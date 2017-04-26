const Rx = require('rxjs/Rx');

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

  sendData()
  {

  }
}

module.exports = Logic;
