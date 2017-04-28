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
    //ritorno un Observable che registra l'applicazione nel ApplicationLocalRegistry e successivamente chiama la complete dell'Observer iscritto
    return new Rx.Observable(function(observer)
    {
      self.registry.register(name, pkg);
      observer.complete();
    });
  }

  query(name)
  {
    let self = this;
    //ritorno un Observable che interroga l'ApplicationLocalRegistry e successivamente chiama la next dell'Observer iscritto con i dati ottenuti.
    return new Rx.Observable(function(observer)
    {
      let app = self.registry.query(name);
      
      observer.next(app);
      observer.complete();
    });
  }

}

module.exports = ApplicationRegistryLocalClient;
