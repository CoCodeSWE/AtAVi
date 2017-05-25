const Rx = require('rxjs/Rx');

class MockLogin
{
  doLogin()
  {
    return Rx.Observable.empty();  //sempre successo
  }
}

module.exports = MockLogin;
