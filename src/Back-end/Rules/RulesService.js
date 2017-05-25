const objectFilter = require('./object-filter');

class RulesService
{
  /**
		* Costruttore della classe
		* @param {RulesDAO} rules - Attributo contenente il RulesDAO
    * @param {TasksDAO} task - Attributo contenente il TasksDAO
		*/
  constructor(rules, tasks)
  {
    this.rules = rules     //RulesDAODynamoDB
    this.tasks = tasks;      //TaskDAODynamoDB
  }

  /**
		* Metodo che implementa la Lambda Function per inserire una rule
		* @param {LambdaEvent} event - All'interno del campo body, sotto forma di stringa in formato JSON, un oggetto Rule contenente tutti i dati relativi ad una Rule da inserire
		* @param {LambdaContext} context - Parametro utilizzato per inviare la risposta
		*/
  addRule(event, context)
  {
    let rule; //conterrà la rule da aggiungere

    try
		{
      rule = JSON.parse(event.body);
    }
    catch (exception)
    {
        // rule non valida: errore 400 (Bad Request)
        badRequest(context);
        return;
    }
    // Parametro contenente i dati relativi alla rule da aggiungere
    let params = objectFilter(rule, ['enabled', 'name', 'targets', 'task']);
    // controllo che rule abbia tutti i campi definiti
    if(('enabled' in params) && params.name && params.targets && params.task)
    {
      this.rules.addRule(params).subscribe(
      {
        next: function(data)
        {
          //il metodo next dell'Observer non riceve nessun tipo di dato
        },

        error: function(err)
				{
					if(err.code === 'ConditionalCheckFailedException')
					{
						context.succeed(
						{
							statusCode: 409,
							body: JSON.stringify({ message: 'Conflict' })
						});
					}
					else
					{
						context.succeed(
						{
							statusCode: 500,
							body: JSON.stringify({ message: 'Internal server error' })
						});
					}
				},

        complete: function()
        {
          context.succeed(
          {
            statusCode: 200,
            body: JSON.stringify({ message: 'success' })
          })
        }
      });
    }
		else
    {
      badRequest(context);
    }
  }

  /**
		* Metodo che implementa la Lambda Function per eliminare una rule
		* @param {LambdaIdEvent} event - Parametro contenente, all'interno del campo pathParameters, il nome della rule che si vuole eliminare
		* @param {LambdaContext} context - Parametro utilizzato per inviare la risposta
		*/
  deleteRule(event, context)
  {
    let rule_name = event.pathParameters.name;
		this.rules.removeRule(rule_name).subscribe(
		{
			next: function(data)
			{
				// Il metodo next dell'Observer non riceve nessun tipo di dato
			},

			error: function(err)
			{
				if(err.code === 'ConditionalCheckFailedException')
				{
					context.succeed(
					{
						statusCode: 404,
						body: JSON.stringify({ message: 'Not found' })
					});
				}
				else
				{
					context.succeed(
					{
						statusCode: 500,
						body: JSON.stringify({ message: 'Internal server error' })
					});
				}
			},

			complete: function()
			{
				context.succeed(
				{
					statusCode: 200,
					body: JSON.stringify({ message: 'success' })
				});
			}
		});
  }

  /**
		* Metodo che implementa la Lambda Function per eliminare una rule
		* @param {LambdaIdEvent} event - Parametro contenente, all'interno del campo pathParameters, il nome della rule che si vuole ottenere
		* @param {LambdaContext} context - Parametro utilizzato per inviare la risposta
		*/
  getRule(event, context)
  {
    let rule_name = event.pathParameters.name;
    let rule; //conterrà la rule che verrà ottenuta
		this.rules.getRule(rule_name).subscribe(
		{
			next: function(data)
			{
				rule = data;
			},

			error: function(err)
			{
				if(err.code === 'Not found')
				{
					context.succeed(
					{
						statusCode: 404,
						body: JSON.stringify({ message: 'Not found' })
					});
				}
				else
				{
					context.succeed(
					{
						statusCode: 500,
						body: JSON.stringify({ message: 'Internal server error' })
					});
				}
			},

			complete: function()
			{
				context.succeed(
				{
					statusCode: 200,
					body: JSON.stringify(rule)
				});
			}
		});
  }

  /**
		* Metodo che implementa la Lambda Function per ottenere la lista delle rules
		* @param {LambdaRuleListEvent} event - Parametro che rappresenta la richiesta ricevuta dal VocalAPI. Eventuali parametri sono contenuti in queryStringParameters
		* @param {LambdaContext} context - Parametro utilizzato per inviare la risposta
		*/
  getRuleList(event,context)
  {
    console.log(event);
    let list =
		{
      rules: []
    };
    // Controllo se ci sono filtri da applicare nell'ottenimento delle rule
		let query = objectFilter(event.queryStringParameters, ['enabled']);
		if(Object.keys(query).length === 0)
			query = null;

    this.rules.getRuleList(query).subscribe(
    {
      next: function(rule)
			{
				let target = objectFilter(event.queryStringParameters, ['target.name', 'target.member', 'target.company']);
        if(Object.keys(target).length > 0)
				{
					let insert = false;
					for(let i = 0; i < rule.targets.length; ++i)
					{
            // Controllo se solo il campo company è impostato
            if(target['target.company'] && !(rule.targets[i].member) && !(rule.targets[i].name))
            {
              if(rule.targets[i].company === target['target.company'] && !(rule.targets[i].member) && !(rule.targets[i].name))
                list.rules.push(rule);
            }
						// Controllo se tutti i tre campi di target sono impostati come filtro
						else if(target['target.name'] && target['target.member'] && target['target.company'])
						{
							if(rule.targets[i].name === target['target.name'] && rule.targets[i].member === target['target.member'] && rule.targets[i].company === target['target.company'])
								list.rules.push(rule);
						}
						// Controllo se i campi member e company sono impostati
						else if(target['target.member'] && target['target.company'])
						{
							if(rule.targets[i].member === target['target.member'] && rule.targets[i].company === target['target.company'])
								list.rules.push(rule);
						}
						// Controllo se i campi company e name sono impostati
						else if(target['target.company'] && target['target.name'])
						{
							if(rule.targets[i].company === target['target.company'] && rule.targets[i].name === target['target.name'])
								list.rules.push(rule);
						}
					}
				}
				else
				{
					list.rules.push(rule);
				}
			},

      error: internalServerError(context),

      complete: function()
      {
        context.succeed(
        {
          statusCode: 200,
          body: JSON.stringify(list)
        });
      }
    });
  }

  /**
		* Metodo che implementa la Lambda Function per ottenere la lista dei tasks
		* @param {LambdaTaskListEvent} event - Parametro che rappresenta la richiesta ricevuta dal VocalAPI. Eventuali parametri sono contenuti in queryStringParameters
		* @param {LambdaContext} context - Parametro utilizzato per inviare la risposta
		*/
  getTaskList(event,context)
  {
    let list =
		{
      tasks: []
    };

    // Controllo se ci sono filtri da applicare nell'ottenimento degli utenti
		let query = objectFilter(event.queryStringParameters);
		if(Object.keys(query).length === 0)
			query = null;

		this.tasks.getTaskList(query).subscribe(
    {
      next: (task) => { list.tasks.push(task); },

			error: internalServerError(context),

      complete: function()
      {
        context.succeed(
        {
          statusCode: 200,
          body: JSON.stringify(list)
        });
      }
    });
  }

  /**
		* Metodo che implementa la Lambda Function per aggiornare una rule
		* @param {LambdaIdEvent} event - Parametro contenente all'interno del campo body, sotto forma di stringa in formato JSON, un oggetto di tipo Rule contenente i dati da aggiornare e, all'interno del campo pathParameters, il nome della rule da modificare.
		* @param {LambdaContext} context - Parametro utilizzato per inviare la risposta
		*/
  updateRule(event,context)
  {
		let rule; // Conterrà le informazioni relative alls rule da aggiornare
		try
		{
			rule = JSON.parse(event.body);
		}
		catch(exception)
		{
			badRequest(context);
			return;
		}

		// Parametro contenente i dati relativi alla rule da aggiungere
		let params = objectFilter(rule, ['enabled', 'targets', 'task']);
		params.id = event.pathParameters.name;

		this.rules.updateRule(params).subscribe(
		{
			next: function(data)
			{
				// Il metodo next dell'Observer non riceve nessun tipo di dato
			},

			error: internalServerError(context),

			complete: function()
			{
				context.succeed(
				{
					statusCode: 200,
					body: JSON.stringify({ message: 'success' })
				});
			}
		});
  }
}

// Funzione per gestire lo status code 500 (error)
function internalServerError(context)
{
	return function(err)
	{
    console.log('internalServerError ', err);
		context.succeed(
		{
			statusCode: 500,
			body: JSON.stringify({ message: 'Internal server error' })
		});
	}
}

// Funzione per gestire lo status code 400
function badRequest(context)
{
  //console.log('badRequest');
	context.succeed(
	{
		statusCode: 400,
		body: JSON.stringify({ message: 'Bad Request' })
	});
}

module.exports = RulesService;
