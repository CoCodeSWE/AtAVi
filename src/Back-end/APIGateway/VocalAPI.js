//TODO: aggiungere session_id e data a tutte le richieste
// nel file dd indica parametri che bisogna definire dove si trovino all'interno
//della risposta dell'assistente virtuale.
const Rx = require('rxjs/Rx');

class VocalAPI
{
  /**
  * Costruttore della classe che implementa la logica dell'api gateway
  * @param {VocalLoginModule} vocal - Modulo utilizzato per effettuare il login vocale degli amministratori
  * @param {JsonWebTokenModule} jwt - Modulo utilizzato per la creazione di JWT
  * @param {RequestPromisModule} rp - Modulo utilizzato per effettuare richieste http ai microservizi utilizzando le Promise
  * @param {STTModule} stt - Modulo utilizzato per la conversione di un file audio in testo
  * @param {AWS.SNS} sns - Modulo utilizzato per pubblicare i dati della interazione su un topic SNS
  */
  constructor(vocal, jwt, rp, stt, sns)
  {
    this.USERS_SERVICE_URL = process.env.USERS_SERVICE_URL;
    this.RULES_SERVICE_URL = process.env.RULES_SERVICE_URL;
    this.VA_SERVICE_URL = process.env.VA_SERVICE_URL;
    this.vocal = vocal;
    this.request_promise = rp;
    this.sns = sns;
    this.stt = stt;
    this.jwt = jwt;
  }

	/**
	* Questa classe si occupa di implementare l'endpoint dell'API Gateway utilizzato dal client vocale
	* @param {LambdaEvent} event - Parametro contenente, all'interno del campo body sotto forma di stringa in formato JSON, un oggetto contenente tutti i dati relativi ad un messaggio ricevuto da API Gateway
	* @param {LambdaContext} context - Parametro utilizzato dalle lambda function per inviare la risposta
	*/
  queryLambda(event, context)
  {
    let self = this;
    let body;
    try
    {
      body = JSON.parse(event.body);
    }
    catch(err)  //non è un JSON valido, quindi la richiesta non è conforme
    {
      context.succeed(
			{
				statusCode: 400,
				body: JSON.stringify({ "message": "Bad Request" })
			});
      return;
    }
    let audio_buffer = Buffer.from(body.audio, 'base64'); //converto da stringa in base64 a Buffer
    self.stt.speechToText(audio_buffer, 'audio/l16').then(function(text)  //quando ho il testo interrogo l'assistente virtuale
    {
      self.text_request = text;
      let req_options =
      {
        method: 'POST',
        uri: VA_SERVICE_URL,
        body:
        {
          text: text,
          session_id: body.session_id
        },
        json: true
      }
      return self.request_promise(req_options); //il prossimo then riceverà direttamente la risposta dell'assistente virtuale
    }).then(self._onVaResponse(context, audio_buffer));
  }
  //context.succeed(statusCode: 200, body: JSON.stringify(response));

  /******* RULE *********/

  /**
  * Metodo che permette di aggiungere una direttiva al sistema
  * @param {Rule} rule - direttiva da aggiungere
  */
  _addRule(rule)
  {
		let self = this;
		return new Rx.Observable(function(observer)
		{
			let options =
			{
				method: 'POST',
				uri: self.RULES_SERVICE_URL,
				body: rule,
				json: true
			};

			self.request_promise(options).then(function(data)
			{
				observer.complete();
			})
			.catch(function(err)
			{
				observer.error(
				{
					code: err.statusCode,
					msg: err.message
				});
			});
		});
  }

  /**
  * Metodo che permette di ottenere una direttiva al sistema
  * @param {String} id - id della direttiva richiesta
  */
  _getRule(id)
  {
		let self = this;
		return new Rx.Observable(function(observer)
		{
			let options =
			{
				method: 'GET',
				uri: `${self.RULES_SERVICE_URL}/${id}`,
				json: true
			};

			self.request_promise(options).then(function(data)
			{
        observer.next(data);
				observer.complete();
			})
			.catch(function(err)
			{
				observer.error(
				{
					code: err.statusCode,
					msg: err.message
				});
			});
		});
  }

  /**
  * Metodo che permette di ottenere la lista delle direttive del sistema
  */
  _getRuleList()
  {
		let self = this;
		return new Rx.Observable(function(observer)
		{
			let options =
			{
				method: 'GET',
				uri: self.RULES_SERVICE_URL,
				json: true
			};

			self.request_promise(options).then(function(data)
			{
				observer.complete();
			})
			.catch(function(err)
			{
				observer.error(
				{
					code: err.statusCode,
					msg: err.message
				});
			});
		});
  }

	/**
  * Metodo che permette di rimuovere una direttiva dal sistema
  * @param {String} id - id della direttiva da rimuovere
  */
  _removeRule(id)
  {
		let self = this;
		return new Rx.Observable(function(observer)
		{
			let options =
			{
				method: 'DELETE',
				uri: `${self.RULES_SERVICE_URL}/${id}`,
				json: true
			};

			self.request_promise(options).then(function(data)
			{
				observer.complete();
			})
			.catch(function(err)
			{
				observer.error(
				{
					code: err.statusCode,
					msg: err.message
				});
			});
		});
  }

	/**
  * Metodo che permette di aggiornare una direttiva dal sistema
  * @param {Rule} rule - Rule da aggiornare
  */
  _updateRule(rule)
  {
		let self = this;
		return new Rx.Observable(function(observer)
		{
			let options =
			{
				method: 'PUT',
				uri: `${self.RULES_SERVICE_URL}/${rule.id}`,
				body: rule,
				json: true
			};

			self.request_promise(options).then(function(data)
			{
				observer.complete();
			})
			.catch(function(err)
			{
				observer.error(
				{
					code: err.statusCode,
					msg: err.message
				});
			});
		});
  }

  /******* USER *********/

	/**
  * Metodo che permette di aggiungere un utente al sistema
  * @param {User} user - Utente da aggiungere
  */
  _addUser(user)
  {
		let self = this;
		return new Rx.Observable(function(observer)
		{
			let options =
			{
				method: 'POST',
				uri: self.USERS_SERVICE_URL,
				body: user,
				json: true
			};

			self.request_promise(options).then(function(data)
			{
				observer.complete();
			})
			.catch(function(err)
			{
				observer.error(
				{
					code: err.statusCode,
					msg: err.message
				});
			});
		});
  }

	/**
  * Metodo che permette di aggiungere un enrollment ad un utente del sistema
  * @param {Enrollment} enr - Parametro contenente l'enrollment da aggiungere a un utente
  */
  _addUserEnrollment(enr)
  {
		let self = this;
		return new Rx.Observable(function(observer)
		{
			let id_user = null;	// Contiene l'id del servizio di Speaker Recognition dell'utente avente username uguale a enr.username
			self._getUser(enr.username).subscribe(
			{
				next: function(user)
				{
					if(user.sr_id)
						id_user = user.sr_id;
					else
					{
						observer.error(
						{
							code: 1,
							msg: 'Not found'
						});
					}
				},

				error: function(err)
				{
					observer.error(
					{
						code: err.statusCode,
						msg: err.message
					});
				},

				complete: function()
				{
					// Sono sicuro che l'utente abbia un sr_id, altrimenti verrebbe chiamato observer.error all'interno del metodo next
					vocal.addEnrollment(id_user, enr.audio).subscribe(
					{
						next: function()
						{
							// Non deve fare nulla
						},

						error: function(err)
						{
							observer.error(
							{
								code: err.statusCode,
								msg: err.message
							});
						},

						complete: function()
						{
							observer.complete();
						}
					});
				}
			});
		});
  }

	/**
	* Metodo che permette di ottenere i dati relativi ad un utente del sistema
	* @param {String} username - Parametro contente l'username dell'utente del quale si vogliono ottenere i dati
	*/
  _getUser(username)
  {
		let self = this;
		return new Rx.Observable(function(observer)
		{
			let options =
			{
				method: 'GET',
				uri: `${self.USERS_SERVICE_URL}/${username}`,
				json: true
			};

			self.request_promise(options).then(function(data)
			{
				observer.complete();
			})
			.catch(function(err)
			{
				observer.error(
				{
					code: err.statusCode,
					msg: err.message
				});
			});
		});
  }

	/**
	* Metodo che permette di ottenere una lista degli utenti del sistema
	* @param {UserListQueryParameters} query - Parametro che indica quali utenti devono essere inclusi nella lista restituita
	*/
  _getUserList(query)
  {
		//Costruisco la query string a partire da un oggetto contenente i valori da mettere nella query string stessa
		let query_string = queryString(query);

		let self = this;
		return new Rx.Observable(function(observer)
		{
			let options =
			{
				method: 'GET',
				uri: `${self.USERS_SERVICE_URL}?${query_string}`,
				json: true
			};

			self.request_promise(options).then(function(data)
			{
				observer.next(data);
				observer.complete();
			})
			.catch(function(err)
			{
				observer.error(
				{
					code: err.statusCode,
					msg: err.message
				});
			});
		});
  }

	/**
	* Metodo che si occupa di gestire il login vocale degli utenti
	* @param {Enrollment} enr - Attributo contenente l'Enrollment (audio + username) con il quale tentare il login
	*/
  _loginUser(enr)
  {
		let self = this;
		return new Rx.Observable(function(observer)
		{
			let id_user = null;	// Contiene l'id del servizio di Speaker Recognition dell'utente avente username uguale a enr.username
			self._getUser(enr.username).subscribe(
			{
				next: function(user)
				{
					if(user.sr_id)
						id_user = user.sr_id;
					else
					{
						observer.error(
						{
							code: 1,
							msg: 'Not found'
						});
					}
				},

				error: function(err)
				{
					observer.error(
					{
						code: err.statusCode,
						msg: err.message
					});
				},

				complete: function()
				{
					// Sono sicuro che l'utente abbia un sr_id, altrimenti verrebbe chiamato observer.error all'interno del metodo next
					vocal.doLogin(id_user, enr.audio).subscribe(
					{
						next: function()
						{
							// Non deve fare nulla
						},

						error: function(err)
						{
							observer.error(
							{
								code: err.statusCode,
								msg: err.message
							});
						},

						complete: function()
						{
							observer.complete();
						}
					});
				}
			});
		});
  }

	/**
	* Metodo che permette di eliminare un utente dal sistema
	* @param {String} username - Parametro contenente l'username dell'user da eliminare dal sistema
	*/
  _removeUser(username)
  {
		let self = this;
		return new Rx.Observable(function(observer)
		{
			let options =
			{
				method: 'DELETE',
				uri: `${self.USERS_SERVICE_URL}/${username}`,
				json: true
			};

			self.request_promise(options).then(function(data)
			{
				observer.complete();
			})
			.catch(function(err)
			{
				observer.error(
				{
					code: err.statusCode,
					msg: err.message
				});
			});
		});
  }

	/**
	* Metodo che permette di eliminare tutti gli enrollments di un utente del sistema
	* @param {String} username - Parametro contenente l'username dell utente a cui si vogliono eliminare tutti gli enrollments
	*/
  _resetUserEnrollment(username)
  {
		let self = this;
		return new Rx.Observable(function(observer)
		{
			let id_user = null;	// Contiene l'id del servizio di Speaker Recognition dell'utente avente username uguale a enr.username
			self._getUser(username).subscribe(
			{
				next: function(user)
				{
					if(user.sr_id)
						id_user = user.sr_id;
					else
					{
						observer.error(
						{
							code: 1,
							msg: 'Not found'
						});
					}
				},

				error: function(err)
				{
					observer.error(
					{
						code: err.statusCode,
						msg: err.message
					});
				},

				complete: function()
				{
					// Sono sicuro che l'utente abbia un sr_id, altrimenti verrebbe chiamato observer.error all'interno del metodo next
					vocal.addEnrollment(id_user).subscribe(
					{
						next: function()
						{
							// Non deve fare nulla
						},

						error: function(err)
						{
							observer.error(
							{
								code: err.statusCode,
								msg: err.message
							});
						},

						complete: function()
						{
							observer.complete();
						}
					});
				}
			});
		});
  }

	/**
	* Metodo che permette di modificare i dati relativi ad un utente del sistema
	* @param {User} user - Parametro contenente l'User da modificare
	*/
  _updateUser(user)
  {
		let self = this;
		return new Rx.Observable(function(observer)
		{
			let options =
			{
				method: 'PUT',
				uri: `${self.USERS_SERVICE_URL}/${user.username}`,
				body: user,
				json: true
			};

			self.request_promise(options).then(function(data)
			{
				observer.complete();
			})
			.catch(function(err)
			{
				observer.error(
				{
					code: err.statusCode,
					msg: err.message
				});
			});
		});
  }

  /**
  * metodo che viene chiamato ogni volta viene ricevuta una risposta dall'assitente virtuale
  * @param {LambdaContext} context - oggetto utilizzato per mandare l'eventuale risposta ad API gateway
  * @param {Buffer} audio_buffer - Buffer contenente l'audio ricevuto
  * @return {function(VAResponse)} - funzione utilizzata come callback, che accetta come parametro la risposta dell'assistente viruale
  */
  _onVaResponse(context, audio_buffer)
  {
    let self = this;
    return function(response) //resti
    {
      let options =
      {
        method: 'POST',
        uri: self.VA_SERVICE_URL,
        json: true,
        body:
        {
          data: response.data,
          session_id: response.session_id
        }
      }

      //aggiungere controllo azione completata oppure no ???

      let params = response.res.contexts[0];
      switch(response.action)
      {
        case 'rule.add':
          options.body.event =
          {
            name: 'addRuleSuccess',  // da definire il vero event come anche i parametri necessari
            data: {}
          };
          self._addRule(
          {
            name: params.name,
            task:
            {
              task: params.task_name
            },
            targets:[
            {
              name: target_name,
              member: target_member,
              copmany: target_company
            }]
          }).subscribe(
          {
            complete: () => context.succeed({statusCode: 200, body: JSON.stringify(response)}),
            error: error(context)
          });
          break;
        case 'rule.getList':
          let rules;
          options.body.event = {name: 'getRuleListSuccess'};
          self._getRuleList(/*dd*/).subscribe(
          {
            next: (data) => {rules = data},
            error: error(context),
            complete: function()
            {
              options.body.event.data = { rules: rules };
              self.request_promise(options).then(self._onVaResponse(context, audio_buffer));
            }
          });
          break;
        case 'rule.get':
          let rule;
          options.body.event = {name: 'getSuccess'};
          self._getRule(/*dd*/).subscribe(
          {
            next: (data) => {rule = data;},
            error: error(context),
            complete: function()
            {
              options.body.event.data = { rule: rule };
              self.request_promise(options).then(self._onVaResponse(context, audio_buffer));
            }
          });
          break;
        case 'rule.remove':
          options.body.event =
          {
            name: 'removeRuleSuccess',
            data: {}
          };
          self._removeRule(/*da definire*/).subscribe(
          {
            complete: () => context.succeed({statusCode: 200, body: JSON.stringify(response)}),
            error: error(context)
          });
          break;
        case 'rule.update':
          options.body.event =
          {
            name: 'updateRuleSuccess',
            data: {}
          };
          this._updateRule(/*dd*/).subscribe(
          {
            complete: () => context.succeed({statusCode: 200, body: JSON.stringify(response)}),
            error: error(context)
          });
          break;
        case 'user.add':
          options.body.event =
          {
            name: 'addUserSuccess',  // da definire il vero event come anche i parametri necessari
            data: {}
          };
          self._addUser(/*da definire*/).subscribe(
          {
            complete: () => context.succeed({statusCode: 200, body: JSON.stringify(response)}),
            error: error(context)
          });
          break;
        case 'user.addEnrollment':
          options.body.event = {name: "addUserEnrollmentSuccess"}
          this._addUserEnrollment({audio: audio_buffer, username: /**/}).subscribe(
          {
            complete: () => context.succeed({statusCode: 200, body: JSON.stringify(response)}),
            error: error(context)
          });
          break;
        case 'user.get':
          let user;
          options.body.event = {name: 'getUserSuccess'};
          self._getUser(/*dd*/).subscribe(
          {
            next: (data) => {user = data;},
            error: error(context),
            complete: function()
            {
              options.body.event.data = { user: user };
              self.request_promise(options).then(self._onVaResponse(context, audio_buffer));
            }
          });
          break;
        case 'user.getList':
          let users;
          options.body.event = {name: 'getUserListSuccess'};
          self._getUserList(/*dd*/).subscribe(
          {
            next: (data) => {users = data},
            error: error(context),
            complete: function()
            {
              options.body.event.data = { users: users };
              self.request_promise(options).then(self._onVaResponse(context, audio_buffer));
            }
          });
          break;
        case 'user.login':
          this._loginUser({audio: audio_buffer, username: 'username' /*da definire dove si trova*/}).subscribe(
          {
            next: function(token)
            {
              options.body.data.token = token;
              options.body.event = {name: 'loginUserSuccess'};
              self.request_promise(options).then(self._onVaResponse(context, audio_buffer));
            },
            error: function(err)
            {
              options.body.event = {name: 'loginUserFailure'};
              self.request_promise(options).then(self._onVaResponse(context, audio_buffer));
            }
          });
          break;
        case 'user.remove':
          options.body.event =
          {
            name: 'removeUserSuccess',
            data: {}
          };
          self._removeUser(/*da definire*/).subscribe(
          {
            complete: () => context.succeed({statusCode: 200, body: JSON.stringify(response)}),
            error: error(context)
          });
          break;
        case 'user.resetEnrollment':
        options.body.event = {name: "resetUserEnrollmentSuccess"}
        this._resetUserEnrollment(/*dd*/}).subscribe(
        {
          complete: () => context.succeed({statusCode: 200, body: JSON.stringify(response)}),
          error: error(context)
        });
        break;
        case 'user.update':
          options.body.event =
          {
            name: 'userUpdateSuccess',
            data: {}
          };
          this._updateuser(/*dd*/).subscribe(
          {
            complete: () => context.succeed({statusCode: 200, body: JSON.stringify(response)}),
            error: error(context)
          });
          break;
        default:  //nel caso in cui l'azione non sia da gestire nel back-end, inoltro la risposta dell'assistente virtuale al client
          context.succeed({ statusCode: 200, body: JSON.stringify(response) });
      }
    }
  }
}

/**
* funzione di utilità utilizzata per restituire un codice d'errore nel caso in cui
* ci sia qualche problema. Forse dovrebbe essere modificata per utilizzare un
* evento dell'assistente virtuale??
* @param {LambdaContext} context - oggetto utilizzato per ritornare la risposta
* contenente il codice d'errore
*/
function error(context)
{
  return function(err)
  {
    context.succeed(
    {
      statusCode: err.code,
      message: JSON.stringify({ message: err.msg })
    });
  }
}

// Viene ritornata una query string contenente i dati dell'oggetto obj
function queryString(obj)
{
	let str = [];
  for(let p in obj)
		str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
  return str.join("&");
}

module.exports = VocalAPI;
