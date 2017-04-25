const Rx = require('rxjs/Rx');

class DataArrivedObservable
{
  constructor(){}

  subscribe(observer)
  {
    return new Rx.Subscription();
  }
}

module.exports = DataArrivedObservable
