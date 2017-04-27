const Rx = require('rxjs/Rx');
const URL = 'www.google.it'

class Logic
{
  constructor()
  {
    this.subject = new Rx.Subject();
  }

  getObservable()
  {
    return this.subject.asObservable();
  }

  sendData(blob)
  {
    return new HttpPromise('POST', URL, 'test', blob);
  }
}

module.exports = Logic;
