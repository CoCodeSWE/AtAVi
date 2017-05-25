/**
* Questa classe si occupa di implementare l'endpoint dell'API Gateway utilizzato dal client vocale.
* @author Simeone Pizzi, Nicola Tintorri e Mattia Bottaro
* @version 0.0.5
* @since 0.0.3-alpha
* @todo gestione degli errori un po' più pensata
* @todo retry delle richieste (utilizzando magari promise-retry {@see https://www.npmjs.com/package/promise-retry})
*/
const Rx = require('rxjs/Rx');

const USERS_SERVICE_URL = process.env.USERS_SERVICE_URL;
const RULES_SERVICE_URL = process.env.RULES_SERVICE_URL;
const VA_SERVICE_URL = process.env.VA_SERVICE_URL;
const USERS_SERVICE_KEY = process.env.USERS_SERVICE_KEY;
const RULES_SERVICE_KEY = process.env.RULES_SERVICE_KEY;
const VA_SERVICE_KEY = process.env.VA_SERVICE_KEY;
const SPEAKER_RECOGNITION_KEY = process.env.SPEAKER_RECOGNITION_KEY;
const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN;
const JWT_SECRET = process.env.JWT_SECRET;
const WRONG_APP = { code: 400, msg: 'Reserved action name' }

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
    console.log(event);
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
        headers: { "Access-Control-Allow-Origin" : "*", "Access-Control-Allow-Credentials" : true },
				body: JSON.stringify({ "message": "Bad Request: \n" + JSON.stringify(err, null, 2) })
			});
      return;
    }
    body.audio = Buffer.from(body.audio, 'base64'); //converto da stringa in base64 a Buffer
    self.stt.speechToText(body.audio, 'audio/l16; rate=16000').then(function(text)  //quando ho il testo interrogo l'assistente virtuale
    {
      let query = {data: body.data, session_id: body.session_id};
      if(text)
      {
        self.text_request = text;
        query.text = text;
      }
      else
      {
        self.text_request = '';
        query.event = {name: 'fallbackEvent', data:{}};
      }
      let req_options =
      {
        method: 'POST',
        uri: VA_SERVICE_URL,
        body:
        {
          app: body.app,
          query: query
        },
        headers:
        {
          'x-api-key': VA_SERVICE_KEY
        },
        json: true
      }
      console.log(JSON.stringify(req_options, null, 2));
      return self.request_promise(req_options) //il prossimo then riceverà direttamente la risposta dell'assistente virtuale
    })
      .catch(function(err)
      {
        console.log(err);
        if(err.name === 'StatusCodeError')
          context.succeed({statusCode: err.statusCode, headers: { "Access-Control-Allow-Origin" : "*", "Access-Control-Allow-Credentials" : true }, body: JSON.stringify({message: 'Internal server error.'})});
        else
          context.succeed({statusCode: 404, headers: { "Access-Control-Allow-Origin" : "*", "Access-Control-Allow-Credentials" : true }, body: JSON.stringify({message: 'Internal server error.'})});
        throw(null);
      })
      .then(self._onVaResponse(context, body).bind(self))
      .catch(function(err)
      {
        console.log(err);
        if(err)
          context.succeed({statusCode: 500, headers: { "Access-Control-Allow-Origin" : "*", "Access-Control-Allow-Credentials" : true }, body: JSON.stringify({message: 'Internal server error.'})});
      });
  }
  //context.succeed(statusCode: 200, body: JSON.stringify(response));

  queryText(event, context)
  {
    console.log('queryText called');
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
        headers: { "Access-Control-Allow-Origin" : "*", "Access-Control-Allow-Credentials" : true },
				body: JSON.stringify({ "message": "Bad Request" })
			});
      return;
    }
    self.text_request = body.text;
    console.log("text: ", self.text_request);
    let req_options =
    {
      method: 'POST',
      uri: VA_SERVICE_URL,
      body:
      {
        app: body.app,
        query:
        {
          text: self.text_request,
          session_id: body.session_id,
          data: body.data
        }
      },
      headers:
      {
        'x-api-key': VA_SERVICE_KEY
      },
      json: true
    }
    self.request_promise(req_options)
      .then(self._onVaResponse(context, body).bind(self))
      .catch(function(err)
      {
        console.log(err);
        if(err)
          context.succeed({statusCode: 500, headers: { "Access-Control-Allow-Origin" : "*", "Access-Control-Allow-Credentials" : true }, body: JSON.stringify({message: 'Internal server error.'})});
      });
  }

  /**
  * RULE
  */

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
				uri: RULES_SERVICE_URL,
				body: rule,
        headers:{'x-api-key': RULES_SERVICE_KEY},
				json: true
			};

			self.request_promise(options).then(function(data)
			{
        console.log(data);
				observer.complete();
			})
			.catch(function(err)
			{
        console.log('error: ', err)
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
				uri: `${RULES_SERVICE_URL}/${id}`,
        headers:{'x-api-key': RULES_SERVICE_KEY},
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
				uri: RULES_SERVICE_URL,
        headers:{'x-api-key': RULES_SERVICE_KEY},
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
				uri: `${RULES_SERVICE_URL}/${id}`,
        headers:{'x-api-key': RULES_SERVICE_KEY},
				json: true
			};

			self.request_promise(options).then(function(data)
			{
        console.log(data);
				observer.complete();
			})
			.catch(function(err)
			{
        console.log("error ", err)
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
				uri: `${RULES_SERVICE_URL}/${rule.id}`,
        headers:{'x-api-key': RULES_SERVICE_KEY},
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
   * USER
   */

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
				uri: USERS_SERVICE_URL,
        headers:{'x-api-key': USERS_SERVICE_KEY},
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
					self.vocal.addEnrollment(id_user, enr.audio).subscribe(
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
    console.log(username);
		let self = this;
		return new Rx.Observable(function(observer)
		{
			let options =
			{
				method: 'GET',
				uri: `${USERS_SERVICE_URL}/${username}`,
        headers:{'x-api-key': USERS_SERVICE_KEY},
				json: true
			};

			self.request_promise(options).then(function(data)
			{
        observer.next(data);
				observer.complete();
			})
			.catch(function(err)
			{
        console.log(err);
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
				uri: `${USERS_SERVICE_URL}?${query_string}`,
        headers:{'x-api-key': USERS_SERVICE_KEY},
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
    console.log(enr);
		let self = this;
		return new Rx.Observable(function(observer)
		{
			let id_user = null;	// Contiene l'id del servizio di Speaker Recognition dell'utente avente username uguale a enr.username
			self._getUser(enr.username).subscribe(
			{
				next: function(user)
				{
          console.log(user);
					if(user.sr_id)
						id_user = user.sr_id;
					else
					{
						observer.error(
						{
							code: 404,
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
          console.log('id_user: ', id_user);
          self.vocal.doLogin(id_user, enr.audio).subscribe(
					{
						next: function()
						{
							// Non deve fare nulla
						},
						error: function(err)
						{
              if(err.error === 2)
                observer.error({ error: 2, code: 401, msg: 'login failed'});
              else
							  observer.error({ error: 1, code: err.statusCode, msg: err.message });
						},
						complete: function()
						{
              observer.next(self.jwt.sign({}, JWT_SECRET, {expiresIn: '6h'}));
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
				uri: `${USERS_SERVICE_URL}/${username}`,
        headers:{'x-api-key': USERS_SERVICE_KEY},
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
  _resetUserEnrollments(username)
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
					self.vocal.resetEnrollments(id_user).subscribe(
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
				uri: `${USERS_SERVICE_URL}/${user.username}`,
        headers:{'x-api-key': USERS_SERVICE_KEY},
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
  * @param {Buffer} body - corpo della richiesta ricevuta, contenente anche un buffer dell'audio in body.audio (al posto dell'audio codificato in base64 delle richiesta originale)
  * @return {function(VAResponse)} - funzione utilizzata come callback, che accetta come parametro la risposta dell'assistente viruale
  */
  _onVaResponse(context, body)
  {
    let self = this;
    return function(response) //restituisce
    {
      console.log('response: ', JSON.stringify(response, null, 2));
      let options =
      {
        method: 'POST',
        uri: VA_SERVICE_URL,
        headers:{'x-api-key': VA_SERVICE_KEY},
        json: true,
        body:
        {
          app: body.app,  //body.app contiene il nome dell'applicazione originale
          query:
          {
            data: response.res.data ? response.res.data : {}, //copio  i dati della risposta dell'assistente virtuale
            session_id: response.session_id
          }
        }
      }

      let params = (response.res.contexts && response.res.contexts[0]) ? response.res.contexts[0].parameters : {};
      switch(response.action)
      {
        case 'rule.add':
          if(body.app === 'admin')
          {
            options.body.query.event =
            {
              name: 'addRuleSuccess',  // da definire il vero event come anche i parametri necessari
              data: {}
            };
            self._addRule(
            {
              name: params.rule_name,
              task:
              {
                type: params.task_name
              },
              targets:[
              {
                name: params.target_name,
                member: params.target_member,
                company: params.target_company
              }],
              enabled: true
            }).subscribe(
            {
              complete: function()
              {
                self.request_promise(options).then(self._onVaResponse(context, body).bind(self)).catch(error(context));
              },
              error: error(context)
            });
          }
          else
            (error(context))(WRONG_APP);
          break;
        case 'rule.getList':
          if(body.app === 'admin')
          {
            let rules;
            options.body.event = {name: 'getRuleListSuccess'};
            self._getRuleList(/*dd*/).subscribe(
            {
              next: (data) => {rules = data},
              error: error(context),
              complete: function()
              {
                options.body.query.event.data = { rules: rules };
                self.request_promise(options).then(self._onVaResponse(context, body).bind(self)).catch(error(context));
              }
            });
          }
          else
            (error(context))(WRONG_APP);
          break;
        case 'rule.get':
          if(body.app === 'admin')
          {
            let rule;
            options.body.event = {name: 'getSuccess'};
            self._getRule(params.id).subscribe(
            {
              next: (data) => {rule = data;},
              error: error(context),
              complete: function()
              {
                options.body.query.event.data = { rule: rule };
                self.request_promise(options).then(self._onVaResponse(context, body).bind(self)).catch(error(context));
              }
            });
          }
          else
            (error(context))(WRONG_APP);
          break;
        case 'rule.remove':
          if(body.app === 'admin')
          {
            options.body.event =
            {
              name: 'removeRuleSuccess',
              data: {}
            };
            self._removeRule(params.rule_id).subscribe(
            {
              complete: function()
              {
                self.request_promise(options).then(self._onVaResponse(context, body).bind(self)).catch(error(context));
              },
              error: error(context)
            });
          }
          else
            (error(context))(WRONG_APP);
          break;
        case 'rule.update':
          if(body.app)
          {
            options.body.event =
            {
              name: 'updateRuleSuccess',
              data: {}
            };
            self._updateRule(
						{
							name: params.rule_name,
              task:
              {
                type: params.task_name
              },
              targets:[
              {
                name: params.target_name,
                member: params.target_member,
                company: params.target_company
              }],
              enabled: true
						}).subscribe(
            {
              complete: function()
              {
                self.request_promise(options).then(self._onVaResponse(context, body).bind(self)).catch(error(context));
              },
              error: error(context)
            });
          }
          else
            (error(context))(WRONG_APP);
          break;
        case 'user.add':
          if(body.app === 'admin')
          {
            options.body.event =
            {
              name: 'addUserSuccess',  // da definire il vero event come anche i parametri necessari
              data: {}
            };
            self._addUser(
            {
              name: params.name,
              username: params.username
            }).subscribe(
            {
              complete: function()
              {
                self.request_promise(options).then(self._onVaResponse(context, body).bind(self)).catch(error(context));
              },
              error: error(context)
            });
          }
          else
            (error(context))(WRONG_APP);
          break;
        case 'user.addEnrollment':
          if(body.app === 'admin')
          {
            options.body.query.event = {name: "addUserEnrollmentSuccess"}
            self._addUserEnrollment({audio: body.audio, username: params.username}).subscribe(
            {
              complete: function()
              {
                self.request_promise(options).then(self._onVaResponse(context, body).bind(self)).catch(error(context));
              },
              error: error(context)
            });
          }
          else
            (error(context))(WRONG_APP);
          break;
        case 'user.get':
          console.log(body.app);
          if(body.app === 'admin')
          {
            let user;
            options.body.query.event = {name: 'getUserSuccess'};
            self._getUser(params.user_username).subscribe(
            {
              next: (data) => {user = data;},
              error: error(context),
              complete: function()
              {
                options.body.query.event.data = { user: JSON.stringify(user, null, 2) };
                self.request_promise(options).then(self._onVaResponse(context, body).bind(self)).catch(error(context));
              }
            });
          }
          else
            (error(context))(WRONG_APP);
          break;
        case 'user.getList':
          if(body.app === 'admin')
          {
            let users;
            options.body.event = {name: 'getUserListSuccess'};
            self._getUserList(/**@todo add query parametr*/).subscribe(
            {
              next: (data) => {users = data},
              error: error(context),
              complete: function()
              {
                options.body.query.event.data = { users: users };
                self.request_promise(options).then(self._onVaResponse(context, body).bind(self)).catch(error(context));
              }
            });
          }
          else
            (error(context))(WRONG_APP);
            break;
        case 'user.login':
          if(options.body.app)
          {
            this._loginUser({audio: body.audio, username: params.username}).subscribe(
            {
              next: function(token)
              {
                console.log('options: ', JSON.stringify(options, null, 2));
                options.body.query.data.token = token;
                options.body.query.event = {name: 'loginUserSuccess', data: {'username': params.username}};
                console.log('options: ', JSON.stringify(options, null, 2));
                self.request_promise(options).then(self._onVaResponse(context, body).bind(self)).catch(error(context));
              },
              error: function(err)
              {
                if(err.error === 2)
                {
                  options.body.event = {name: 'loginUserFailure'};
                  self.request_promise(options).then(self._onVaResponse(context, body).bind(self)).catch(error(context));
                }
                else
                  (error(context))(err);
              },
  						complete: function()
              {
                self.request_promise(options).then(self._onVaResponse(context, body).bind(self)).catch(error(context));
              }
            });
          }
          else
            (error(context))(WRONG_APP);
          break;
        case 'user.remove':
          if(body.app === 'admin')
          {
            options.body.event =
            {
              name: 'removeUserSuccess',
              data: {}
            };
            self._removeUser(params.username).subscribe(
            {
              complete: function()
              {
                self.request_promise(options).then(self._onVaResponse(context, body).bind(self)).catch(error(context));
              },
              error: error(context)
            });
          }
          else
            (error(context))(WRONG_APP);
          break;
        case 'user.resetEnrollments':
          if(body.app === 'admin')
          {
            options.body.event = {name: "resetUserEnrollmentsSuccess"}
            self._resetUserEnrollments(params.username).subscribe(
            {
              complete: function()
              {
                self.request_promise(options).then(self._onVaResponse(context, body).bind(self)).catch(error(context));
              },
              error: error(context)
            });
          }
          else
            (error(context))(WRONG_APP);
          break;
        case 'user.update':
          if(body.app === 'admin')
          {
            options.body.event =
            {
              name: 'userUpdateSuccess',
              data: {}
            };

						let user;
						self._getUser(params.username).subscribe(
						{
							next: function(data)
							{
								user = data;
								if(params.name)
									user.name = params.name;
							},

							error: error(context),

							complete: function()
							{
								self._updateUser(user).subscribe(
								{
									complete: function()
									{
										self.request_promise(options).then(self._onVaResponse(context, body).bind(self)).catch(error(context));
									},
									error: error(context)
								});
							}
						});
          }
          else
            (error(context))(WRONG_APP);
          break;
        case 'app.switch':  // transizione tra diverse applicazioni
          if(params.new_app)
          {
            options.body.app = params.new_app;  //cambio app, in modo che venga interrogato l'agent adeguato
            body.app = params.new_app;  //in questo caso il cambiamento di agent è permesso, quindi aggiorno il nome dell'applicazione originale
            delete params.new_app;
            options.body.query.event = { name: 'init', data: params };
            console.log('options: ', options);
            self.request_promise(options).then(self._onVaResponse(context, body).bind(self)).catch(error(context));
            break;
          }
        default:  //nel caso in cui l'azione non sia da gestire nel back-end, inoltro la risposta dell'assistente virtuale al client
          this.sns.publish({Message: JSON.stringify(response), TopicArn: SNS_TOPIC_ARN},(err, data) =>
          {
            if(err)
              (error(context))({ code: 500, msg: 'Cannot notify: ' + JSON.stringify(err, null, 2)});
            else
            {
              response.res.text_request = self.text_request;
              context.succeed({ statusCode: 200, headers: { "Access-Control-Allow-Origin" : "*", "Access-Control-Allow-Credentials" : true }, body: JSON.stringify(response) });
            }
          });
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
    console.log(err);
    context.succeed(
    {
      statusCode: err.code,
      headers: { "Access-Control-Allow-Origin" : "*", "Access-Control-Allow-Credentials" : true },
      body: JSON.stringify({ message: err.msg })
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
