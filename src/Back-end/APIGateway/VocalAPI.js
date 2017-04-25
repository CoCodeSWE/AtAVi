class VocalAPI
{
  constructor(vocal, jwt, rp, stt, sns)
  {
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

  _addRule(rule){
  }

  _getRule(id){ // id è una stringa

  }
  _getRuleList(){

  }

  _removeRule(id){

  }

  _updateRule(rule){

  }

  /******* USER *********/

  _addUser(user){
  }

  _addUserEnrollment(enr){

  }

  _getUser(username){

  }

  _getUserList(){

  }

  _loginUser(enr){

  }

  _removeUser(username){

  }

  _resetUserEnrollment(username){

  }

  _updateUser(user){

  }

}

module.exports = VocalAPI;
