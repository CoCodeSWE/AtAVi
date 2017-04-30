const Rx = require('rxjs/Rx');

class VocalAPI
{
  /**
  * Costruttore della classe che implementa la logica dell'api gateway
  * @param vocal {VocalLoginModule} - Modulo utilizzato per effettuare il login vocale degli amministratori
  * @param jwt {JsonWebTokenModule} - Modulo utilizzato per la creazione di JWT
  * @param rp {RequestPromisModule} - Modulo utilizzato per effettuare richieste http ai microservizi utilizzando le Promise
  * @param stt {STTModule} - Modulo utilizzato per la conversione di un file audio in testo
  * @param sns {AWS.SNS} - Modulo utilizzato per pubblicare i dati della interazione su un topic SNS
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
	* @param event {LambdaEven} - Parametro contenente, all'interno del campo body sotto forma di stringa in formato JSON, un oggetto contenente tutti i dati relativi ad un messaggio ricevuto da API Gateway
	* @param context {LambdaContext} - Parametro utilizzato dalle lambda function per inviare la risposta
	*/
  queryLambda(event, context)
  {
    switch(action)
    {
      case 'rule.add':
        this._addRule();
        break;
      case 'rule.get':
        this._getRule();
        break;
      case 'rule.getList':
        this._getRuleList();
        break;
      case 'rule.remove':
        this._removeRule();
        break;
      case 'rule.update':
        this._updateRule();
        break;
      case 'user.add':
        this._addUser();
        break;
      case 'user.addEnrollment':
        this._addUserEnrollment();
        break;
      case 'user.get':
        this._getUser();
        break;
      case 'user.getList':
        this._getUserList();
        break;
      case 'user.login':
        this._loginUser();
        break;
      case 'user.remove':
        this._removeUser();
        break;
      case 'user.resetEnrollment':
        this._resetUserEnrollment();
        break;
      case 'user.update':
        this._updateUser();
        break;
    }
  }
  //context.succeed(response);

  /******* RULE *********/

  /**
  * Metodo che permette di aggiungere una direttiva al sistema
  * @param rule {Rule} - direttiva da aggiungere
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
					code: 500,
					msg: 'Internal server error'
				});
			});
		});
  }

  /**
  * Metodo che permette di ottenere una direttiva al sistema
  * @param id {String} - id della direttiva richiesta
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
				observer.complete();
			})		
			.catch(function(err)
			{
				observer.error(
				{
					code: 500,
					msg: 'Internal server error'
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
					code: 500,
					msg: 'Internal server error'
				});
			});
		});
  }

	/**
  * Metodo che permette di rimuovere una direttiva dal sistema
  * @param id {String} - id della direttiva da rimuovere
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
					code: 500,
					msg: 'Internal server error'
				});
			});
		});
  }

	/**
  * Metodo che permette di aggiornare una direttiva dal sistema
  * @param rule {Rule} - Rule da aggiornare
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
					code: 500,
					msg: 'Internal server error'
				});
			});
		});
  }

  /******* USER *********/

	/**
  * Metodo che permette di aggiungere un utente al sistema
  * @param user {User} - Utente da aggiungere
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
					code: 500,
					msg: 'Internal server error'
				});
			});
		});
  }

	/**
  * Metodo che permette di aggiungere un enrollment ad un utente del sistema
  * @param enr {Enrollment} - Parametro contenente l'enrollment da aggiungere a un utente
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
					observer.error(err);
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
							observer.error(err);
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
	* @param username {String} - Parametro contente l'username dell'utente del quale si vogliono ottenere i dati
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
					code: 500,
					msg: 'Internal server error'
				});
			});
		});
  }

	/**
	* Metodo che permette di ottenere una lista degli utenti del sistema
	* @param query {UserListQueryParameters} - Parametro che indica quali utenti devono essere inclusi nella lista restituita
	*/
  _getUserList(query)
  {
		//Costruisco la query string a partire da un oggetto contenente i valori da mettere nella query string stessa
		
  }

	/**
	* Metodo che si occupa di gestire il login vocale degli utenti
	* @param enr {Enrollment} - Attributo contenente l'Enrollment (audio + username) con il quale tentare il login
	*/
  _loginUser(enr)
  {
		
  }

	/**
	* Metodo che permette di eliminare un utente dal sistema
	* @param username {String} - Parametro contenente l'username dell'user da eliminare dal sistema
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
					code: 500,
					msg: 'Internal server error'
				});
			});
		});
  }

	/**
	* Metodo che permette di eliminare tutti gli enrollments di un utente del sistema
	* @param username {String} - Parametro contenente l'username dell utente a cui si vogliono eliminare tutti gli enrollments
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
					observer.error(err);
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
							observer.error(err);
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
	* @param user {User} - Parametro contenente l'User da modificare
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
					code: 500,
					msg: 'Internal server error'
				});
			});
		});
  }
}

module.exports = VocalAPI;
