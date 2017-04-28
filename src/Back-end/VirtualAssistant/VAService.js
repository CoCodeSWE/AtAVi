class VAService
{
	// Costruttore del metodo
	constructor(agents, va)
	{
		this.agents = agents;
		this.va_module = va;
	}
	
	// Implementa la Lambda Function che si occupa di interrogare l'assistente virtuale
	query(event, context)
	{
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
						success(context, data);
					})
					.catch(function(err)
					{
						internalServerError(context);
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
function internalServerError(context)
{
	context.succeed(
	{
		statusCode: 500,
		body: JSON.stringify({ message: 'Internal server error' })
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
