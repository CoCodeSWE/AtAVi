const objectFilter = require('./object-filter');
class RulesService
{
  /**
		* Costruttore della classe
		* @param {RulesDAO} rules - Attributo contenente il RulesDAO
    * @param {TasksDAO} task - Attributo contenente il TasksDAO
		*/
  constructor(rules,task)
  {
    this.rules = rules     //RulesDAODynamoDB
    this.task = task;      //TaskDAODynamoDB
  }

  /**
		* Metodo che implementa la Lambda Function per inserire una rule
		* @param {LambdaEvent} event - All'interno del campo body, sotto forma di stringa in formato JSON, un oggetto Rule contenente tutti i dati relativi ad una Rule da inserire
		* @param {LambdaContext} context - Parametro utilizzato per inviare la risposta
		*/
  addRule(event,context)
  {
    let rule; //conterrà la rule da aggiungere

    try {
      rule=JSON.parse(event.body);
    }
    catch (exception)
    {
        //rule non valida: errore 400 (Bad Request)
        badRequest(context);
        return;
    }
    // Parametro contenente i dati relativi alla rule da aggiungere
		let params = objectFilter(rule , ['enabled', 'id', 'name', 'targets', 'task']);
    // controllo che rule abbia tutti i campi definiti
    if(isDefined(rule.enabled) && isDefined(rule.id) && isDefined(rule.name) && isDefined(rule.targets[0].company) && isDefined(rule.targets[0].member) && isDefined(rule.targets[0].name) && isDefined(rule.task.type) && isDefined(rule.task.params))
    {
      this.rules.addRule(params).subscribe(
      {
        next:function(data)
        {
          //il metodo next dell'Observer non riceve nessun tipo di dato
        },

        error:internalServerError(context),

        complete:function()
        {
          context.succeed(
          {
            statusCode:200,
            body: JSON.stringify({ message: 'success' })
          })
        }
      });
    }else
    {
      badRequest(context);
    }
  }

  /**
		* Metodo che implementa la Lambda Function per eliminare una rule
		* @param {LambdaIdEvent} event - Parametro contenente, all'interno del campo pathParameters, l'id della rule che si vuole eliminare
		* @param {LambdaContext} context - Parametro utilizzato per inviare la risposta
		*/
  deleteRule(event,context)
  {
    let rule_id;
    if(event.pathParameters)
    {
      rule_id=event.pathParameters;
      this.rules.removeRule(rule_id).subscribe(
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
    }	else
  		{
  			// Event non contiene i dati attesi: Bad Request(400)
  			badRequest(context);
  		}
  }
  /**
		* Metodo che implementa la Lambda Function per eliminare una rule
		* @param {LambdaIdEvent} event - Parametro contenente, all'interno del campo pathParameters, l'id della rule che si vuole ottenere
		* @param {LambdaContext} context - Parametro utilizzato per inviare la risposta
		*/
  getRule(event,context)
  {
    let rule_id;
    let rule; //conterrà la rule che verrà ottenuta
    if(event.pathParameters)
    {
      rule_id=event.pathParameters;
      this.rules.getRule(rule_id).subscribe(
      {
        next: function(data)
        {
          rule = data;
        },

        error: function(err)
        {
          if(err.code === 'Not Found')
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
    }	else
  		{
  			// Event non contiene i dati attesi: Bad Request(400)
  			badRequest(context);
  		}
  }
  /**
		* Metodo che implementa la Lambda Function per ottenere la lista delle rules
		* @param {LambdaRuleListEvent} event - Parametro che rappresenta la richiesta ricevuta dal VocalAPI. Eventuali parametri sono contenuti in queryStringParameters
		* @param {LambdaContext} context - Parametro utilizzato per inviare la risposta
		*/
  getRuleList(event,context)
  {
    let list = {        //conterrà la lista delle rules
      Items: []
    };


    // Controllo se ci sono filtri da applicare nell'ottenimento delle rule
		let query = objectFilter(event.queryStringParameters, ['enabled', 'name', 'target.name','target.company','target.member']);
		if(Object.keys(query).length === 0)
			query = null;

    this.rules.getRuleList(query).subscribe(
    {
      next: (rule) => { list.Items.push(rule);},
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
    let list = {                  //conterrà la lista dei task
      Items: []
    };
    // Controllo se ci sono filtri da applicare nell'ottenimento degli utenti
		let query = objectFilter(event.queryStringParameters);
		if(Object.keys(query).length === 0)
			query = null;
    this.task.getTaskList(query).subscribe(
    {
      next: (task) => { list.Items.push(task); },
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
		* @param {LambdaIdEvent} event - Parametro contenente all'interno del campo body, sotto forma di stringa in formato JSON, un oggetto di tipo Rule contenente i dati da aggiornare e, all'interno del campo pathParameters, l'id della rule da modificare.
		* @param {LambdaContext} context - Parametro utilizzato per inviare la risposta
		*/
  updateRule(event,context)
  {
    if(event.pathParameters)
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
			let params = rule;
			params.id=event.pathParameters;


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
		else
		{
			badRequest(context);
		}
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
  console.log('badRequest');
	context.succeed(
	{
		statusCode: 400,
		body: JSON.stringify({ message: 'Bad Request' })
	});
}
// funzione che controlla se una variabile è definita
function isDefined(prop){
   return (prop === 'undefined') ? false : true;
}

module.exports = RulesService;
