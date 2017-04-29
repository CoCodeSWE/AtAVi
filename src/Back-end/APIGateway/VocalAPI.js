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
	* @param query {} - 
	*/
  _getUserList(query)
  {

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
