const Rx = require('rxjs/Rx');

class ApplicationRegistryLocalClient
{
  constructor(client)
  {
    this.registry = client;
  }

  register(name, pkg)
  {
    let self = this;
    return new Rx.Observable(function(observer)
    {
      self.registry.register(name, pkg);
      observer.complete();
    });
  }

  query(name)
  {
    let self = this;
    return new Rx.Observable(function(observer)
    {
      let app = self.registry.query(name);

      if (app === null)
        observer.error();
      else
      {
        observer.next(app);
        observer.complete();
      }
    });
  }

}

module.exports = ApplicationRegistryLocalClient;
