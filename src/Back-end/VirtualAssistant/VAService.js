/**
* Questa classe si occupa di rappresentare il microservizio \file{Virtual Assistant}.
* @author Luca Bertolini
* @version 0.0.4
* @since 0.0.3-alpha
*/
const DEF_ACTION = '.displayMsgs';

class VAService
{
	/**
		* Costruttore del metodo
		* @param {AgentsDAO} agents - Fornisce i meccanismi d'accesso al database degli Agent disponibili
		* @param {VAModule} va - Permette di interrogare un Agent di api.ai
		*/
	constructor(agents, va)
	{
		this.agents = agents;
		this.va_module = va;
	}

	/**
		* Implementa la Lambda Function che si occupa di interrogare l'assistente virtuale
		* @param {LambdaEvent} event - Contiene l'evento con i dati relativi alla richiesta di API Gateway
		* @param {LambdaContext} context - Parametro utilizzato per inviare la risposta
		*/
	query(event, context)
	{
    //console.log(event);
		let self = this;
		let request;	// Conterrà i dati relativi alla richiesta
		try
		{
			request = JSON.parse(event.body);
		}
		catch(exception)
		{
			// La stringa passata non corrisponde ad un JSON
			badRequest(context);
			return;
		}
    console.log(JSON.stringify(request, null, 2));
		// Controllo che ci siano i campi necessari a effettuare la richiesta
		if(request.app && request.query)
		{
			let token;	// Token relativo all'agente con il nome contenuto in request.app
			this.agents.getAgent(request.app).subscribe(
			{
				next: function(data)
				{
					self.va_module.setAgent(data);
				},
				error: function(err)
				{
          console.log("error: ", err);
					context.succeed(
					{
						statusCode: err.statusCode,
						body: JSON.stringify(err.message)
					});
				},
				complete: function()
				{
					self.va_module.query(request.query).then(function(data)
					{
            if(!data.action)
              data.action = request.app + DEF_ACTION;
            console.log('data', data);
						success(context, data);
					})
					.catch(function(err)
					{
            console.log('err', err);
						ServerError(context, err.statusCode);
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

// Funzione per gestire lo status code 400
function badRequest(context)
{
	context.succeed(
	{
		statusCode: 400,
		body: JSON.stringify({ message: 'Bad Request' })
	});
}

// Funzione per gestire lo status code 500
function ServerError(context, status)
{
	context.succeed(
	{
		statusCode: status,
		body: JSON.stringify({ message: 'Error' })
	});
}

// Funzione per gestire lo status code 200
function success(context, data)
{
	context.succeed(
	{
		statusCode: 200,
		body: JSON.stringify(data)
	});
}

module.exports = VAService;
