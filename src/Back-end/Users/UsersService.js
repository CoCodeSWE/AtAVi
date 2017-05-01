const objectFilter = require('./object-filter');

class UsersService
{
	/**
		* Costruttore della classe
		* @param users {UsersDAO} - Attributo contenente lo UsersDAO
		*/
	constructor(users)
	{
		this.users = users; // UsersDAODynamoDB
	}

	/**
		* Metodo che implementa la Lambda Function per inserire uno user
		* @param event {LambdaEvent} - All'interno del campo body, sotto forma di stringa in formato JSON, un oggetto User contenente tutti i dati relativi ad un utente da inserire
		* @param context {LambdaContext} - Parametro utilizzato per inviare la risposta
		*/
	addUser(event, context)
	{
		let user; // Conterrà l'user del body dell'event

		try
		{
			user = JSON.parse(event.body);
		}
		catch(exception)
		{
			//user non valido: errore 400 (Bad request)
			badRequest(context);
			return;
		}

		// Parametro contenente i dati relativi all'user da aggiungere
		let params = objectFilter(user, ['username', 'name', 'sr_id', 'password', 'slack_channel']);
		// Controllo che user abbia almeno i campi obbligatori (name e username)
		if(user.username && user.name)
		{
			this.users.addUser(params).subscribe(
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

	/**
		* Metodo che implementa la Lambda Function per eliminare uno user
		* @param event {LambdaIdEvent} - Parametro contenente, all'interno del campo pathParameters, l'username dell'utente registrato che si vuole eliminare
		* @param context {LambdaContext} - Parametro utilizzato per inviare la risposta
		*/
	deleteUser(event, context)
	{
		let username;
		if(event.pathParameters)
		{
			username = event.pathParameters;
			this.users.deleteUser(username).subscribe(
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
		else
		{
			// Event non contiene i dati attesi: Bad Request(400)
			badRequest(context);
		}
	}

	/**
		* Metodo che implementa la Lambda Function per ottenere uno user
		* @param event {LambdaIdEvent} - Parametro contenente, all'interno del campo pathParameters, l'username dell'utente registrato del quale si vogliono ottenere i dati
		* @param context {LambdaContext} - Parametro utilizzato per inviare la risposta
		*/
	getUser(event, context)
	{
		let username = event.pathParameters;
		let user; // Conterrà i dati relativi all'user
		this.users.getUser(username).subscribe(
		{
			next: function(data)
			{
				user = data;
			},

			error: function(err)
			{
				if(err === 'Not found')
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
	}

	/**
		* Metodo che implementa la Lambda Function per ottenere la lista degli users
		* @param event {LambdaUserListEvent} - Parametro che rappresenta la richiesta ricevuta dal VocalAPI. Eventuali parametri sono contenuti in queryStringParameters
		* @param context {LambdaContext} - Parametro utilizzato per inviare la risposta
		*/
	getUserList(event, context)
	{
		let list =
		{
			users: []
		};

		// Controllo se ci sono filtri da applicare nell'ottenimento degli utenti
		let query = objectFilter(event.queryStringParameters, ['name', 'slack_channel']);
		if(Object.keys(query).length === 0)
			query = null;

		this.users.getUserList(query).subscribe(
		{
			next: (user) => { list.users.push(user); },
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
		* Metodo che implementa la Lambda Function per aggiornare uno user
		* @param event {LambdaIdEvent} - Parametro contenente all'interno del campo body, sotto forma di stringa in formato JSON, un oggetto di tipo User contenente i dati da aggiornare e, all'interno del campo pathParameters, l'username dell'utente da modificare.
		* @param context {LambdaContext} - Parametro utilizzato per inviare la risposta
		*/
	updateUser(event, context)
	{
		if(event.pathParameters)
		{
			let user; // Conterrà le informazioni relative all'utente da aggiornare
			try
			{
				user = JSON.parse(event.body);
			}
			catch(exception)
			{
				badRequest(context);
				return;
			}

			// Parametro contenente i dati relativi all'user da aggiornare
			let params = objectFilter(user, ['name', 'sr_id', 'password', 'slack_channel']);
			params.username = event.pathParameters;

			this.users.updateUser(params).subscribe(
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

module.exports = UsersService;
