const CmdRunner = require('./CmdRunner');
const Rx = require('rxjs/Rx');

const USERS_SERVICE_URL = process.env.USERS_SERVICE_URL;
const USERS_SERVICE_KEY = process.env.USERS_SERVICE_KEY;
const JWT_SECRET = process.env.JWT_SECRET;

class UserHandler extends CmdRunner
{
  /**
   * constructor - description
   *
   * @param  {CmdRunner} next      prossimo runner nella catena
   * @param  {Function} callback     callback chiamato errore o di successo
   * @param  {JsonWebTokenModule} jet modulo jsonwebtoken
   * @param  {RequestPromiseModule} rp        modulo request-promise
   * @param  {VocalLoginModule} vocal     modulo utilizzato per il login vocale
   */
  constructor(next, jwt, rp, vocal)
  {
    super(next);
    this.request_promise = rp;
    this.vocal = vocal;
    this.jwt = jwt;
  }

  handler(response, body)
  {
    return new Promise((resolve, reject) =>
    {
      if(!response)
        resolve(super.handler(null, body));
      else
      {
        let action = response.action;
        let params = (response.res.contexts && response.res.contexts[0]) ? response.res.contexts[0].parameters : {};
        let query = {event: {}, data: response.data ? response.data : {}};
        switch(action)
        {
          case 'user.add':
            if(body.app === 'admin')
            {
              query.event = { name: 'addUserSuccess', data: {}};
              this._addUser(
              {
                name: params.name,
                username: params.user_username
              }).subscribe(
              {
                complete: () => { resolve(query);},
                error: (err) =>
								{
									query.event.name = "error409_user";
									query.event.data = { username: params.username, user_username: params.user_username };
									resolve(query);
								}
              });
            }
            else
              reject(WRONG_APP);
            break;
          case 'user.addEnrollment':
            if(body.app === 'admin')
            {
              query.event = {name: "addUserEnrollmentSuccess", data: {}};
              this._addUserEnrollment({audio: body.audio, username: params.username}).subscribe(
              {
                complete: () => { resolve(query);},
                error: reject
              });
            }
            else
              reject(WRONG_APP);
            break;
          case 'user.get':
            console.log(body.app);
            if(body.app === 'admin')
            {
              let user;
              query.event = {name: 'getUserSuccess'};
              this._getUser(params.user_username).subscribe(
              {
                next: (data) => {user = data;},
                error: (err) => 
								{
									query.event.name = "error404";
									query.event.data = { username: params.username };
									resolve(query);
								},
                complete: () =>
                {
                  query.event.data = { user: JSON.stringify(user, null, 2) };
                  resolve(query);
                }
              });
            }
            else
              reject(WRONG_APP);
            break;
          case 'user.getList':
            if(body.app === 'admin')
            {
              let users;
              query.event = {name: 'getUserListSuccess'};
              this._getUserList(/**@todo add query parametr*/).subscribe(
              {
                next: (data) => {users = data},
                error: reject,
                complete: function()
                {
                  query.event.data = { users: users.users, username: params.username };
                  resolve(query);
                }
              });
            }
            else
              reject(WRONG_APP);
              break;
          case 'user.login':
            if(body.app)
            {
              this._loginUser({audio: body.audio, username: params.username}).subscribe(
              {
                next: (token) =>
                {
                  query.event = { name: 'loginUserSuccess', data: {'username': params.username}}
                  query.data = Object.assign(query.data, {token: token });
                  resolve(query);
                },
                error: (err) =>
                {
                  if(err.error === 2)
                  {
                    query.event = {name: 'loginUserFailure'};
                    resolve(query);
                  }
                  else
                    reject(err);
                }
              });
            }
            else
              reject(WRONG_APP);
            break;
          case 'user.remove':
            if(body.app === 'admin')
            {
              query.event = { name: 'removeUserSuccess', data: { username: params.username } };
              this._removeUser(params.user_username).subscribe(
              {
                complete: () =>
                {
                  resolve(query);
                },
                error: (err) =>
								{
									query.event.name = "error404";
									resolve(query);
								}
              });
            }
            else
              reject(WRONG_APP);
            break;
          case 'user.resetEnrollments':
            if(body.app === 'admin')
            {
              query.event = {name: "resetUserEnrollmentsSuccess"};
              this._resetUserEnrollments(params.username).subscribe(
              {
                complete: () =>
                {
                  resolve(query);
                },
                error: reject
              });
            }
            else
              reject(WRONG_APP);
            break;
          case 'user.update':
            if(body.app === 'admin')
            {
              query.event = { name: 'userUpdateSuccess', data: { username: params.username } };
              let user;
              this._getUser(params.user_username).subscribe(
              {
                next: (data) =>
                {
                  user = data;
                  if(params.name)
                    user.name = params.name;
                },
                error: (err) =>
								{
									query.event.name = "error404";
									resolve(query);
								},
                complete: () =>
                {
                  this._updateUser(user).subscribe(
                  {
                    complete: () =>
                    {
                      resolve(query);
                    },
                    error: (err) =>
										{
											query.event.name = "error500";
											resolve(query);
										}
                  });
                }
              });
            }
            else
              reject(WRONG_APP);
            break;
          default:
            resolve(super.handler(response, body));
        }
      }
    });
  }

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
		let query_string = this.queryString(query);

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
}

module.exports = UserHandler;
