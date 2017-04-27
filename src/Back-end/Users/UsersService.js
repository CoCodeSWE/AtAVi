class UsersService
{
	// Costruttore della classe
	constructor(users)
	{
		this.users = users; // UsersDAODynamoDB
	}

	// Metodo che implementa la Lambda Function per inserire uno user
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

		// Controllo che user abbia almeno i campi obbligatori (name e username)
		if(user.username && user.name)
		{
			// Parametro contenente i dati relativi all'user da aggiungere
			let params =
			{
				username: user.username,
				name: user.name
			};

			// Controllo se ci sono eventuali campi opzionali
			if(user.sr_id)
				params.sr_id = user.sr_id;

			if(user.password)
				params.password = user.password;

			if(user.slack_channel)
				params.slack_channel = user.slack_channel;

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

	// Metodo che implementa la Lambda Function per eliminare uno user
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

	// Metodo che implementa la Lambda Function per ottenere uno user
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

	// Metodo che implementa la Lambda Function per ottenere la lista degli users
	getUserList(event, context)
	{
		console.log(event);
		let list = {
			users: []
		};
		this.users.getUserList().subscribe(
		{
			next: function(data)
			{
				data.Items.forEach((user) => { list.users.push(user); });
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

	// Metodo che implementa la Lambda Function per aggiornare uno user
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

			// Parametro contenente i dati relativi all'user da aggiungere
			let params =
			{
				username: event.pathParameters
			};

			// Controllo eventuali campi opzionali da aggiungere a params
			if(user.name)
				params.name = user.name;

			if(user.sr_id)
				params.sr_id = user.sr_id;

			if(user.password)
				params.password = user.password;

			if(user.slack_channel)
				params.slack_channel = user.slack_channel;

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
