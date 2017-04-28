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

  }

  /**
  * Metodo che permette di ottenere una direttiva al sistema
  * @param id {String} - id della direttiva richiesta
  */
  _getRule(id)
  {

  }

  /**
  * Metodo che permette di ottenere la lista delle direttive del sistema
  * @param id {String} - id della direttiva richiesta
  */
  _getRuleList()
  {

  }

  _removeRule(id)
  {

  }

  _updateRule(rule)
  {

  }

  /******* USER *********/

  _addUser(user)
  {

  }

  _addUserEnrollment(enr)
  {

  }

  _getUser(username)
  {

  }

  _getUserList()
  {

  }

  _loginUser(enr)
  {

  }

  _removeUser(username)
  {

  }

  _resetUserEnrollment(username)
  {

  }

  _updateUser(user)
  {

  }
}

module.exports = VocalAPI;
