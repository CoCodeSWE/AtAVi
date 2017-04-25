class RulesService
{
  //costruttore della classe
  constructor(rules,task)
  {
    this.rules = rules     //RulesDAODynamoDB
    this.task = task;      //TaskDAODynamoDB
  }

  // metodo che implementa la lambda function per aggiungere una rule
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

    // controllo che rule abbia tutti i campi definiti
    if(rule.enabled && rule.id && rule.name && rule.targets[0].company && rule.targets[0].member && rule.targets[0].name && rule.task.type)
    {
      this.rules.addRule(rule).subscribe(
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
            statusCode:200;
            body: JSON.stringify({ message: 'success' })
          })
        }
      });
    }else
    {
      badRequest(context);
    }
  }

  //metodo che implementa la lambda function per l'eliminazione di una rule
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
            body: JSON.stringify(user)
          });
        }
      });
    }	else
  		{
  			// Event non contiene i dati attesi: Bad Request(400)
  			badRequest(context);
  		}
  }
  //metodo che implementa la lambda function per ottenere la lista delle rule
  getRuleList(event,context)
  {
    let list = {        //conterrà la lista delle rules
      rule_items: []
    };
    this.rules.getRuleList().subscribe(
    {
      next: function(data)
      {
        data.Items.forEach((rule) => { list.rule_items.push(rule); });
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
  //metodo che implementa la lambda function per ottenere la lista dei task
  getTaskList(event,context)
  {
    let list = {                  //conterrà la lista dei task
      task_items: []
    };
    this.task.getTaskList().subscribe(
    {
      next: function(data)
      {
        data.Items.forEach((task) => { list.task_items.push(task); });
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
  //metodo che implementa la lambda fucntion per ottenere le rule applicate a dei target
  queryRule(event,context)
  {
    let targets;                //conterrà la lista dei target
    let list = {                //conterrà la lista delle rule
      rule_items: []
    };

    try
    {
      targets = JSON.parse(event.body);
    }
    catch(exception)
    {
      badRequest(context);
      return;
    }
    this.rules.query(targets).subscribe(
    {
      next: function(data)
      {
        data.Items.forEach((rule) => { list.rule_items.push(rule); });
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
  //metodo che implementa la lambda function per modificare una rule
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
	context.succeed(
	{
		statusCode: 400,
		body: JSON.stringify({ message: 'Bad Request' })
	});
}

module.exports = RulesService;
