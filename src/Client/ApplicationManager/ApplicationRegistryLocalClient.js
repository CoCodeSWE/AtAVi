const Rx = require('rxjs/Rx');

class ApplicationRegistryLocalClient
{
  /**
  * Costruttore del registro che interroga l'ApplicationLocalRegistry.
  * @param client {ApplicationLocalRegistry} registro contenente i package delle applicazioni diponibili. Ne facciamo qui la dependency injection.
  */
  constructor(client)
  {
    this.registry = client;
  }

  /**
  * Metodo utilizzato per aggiungere o aggiornare il package di una applicazione.
  * @param name {String} nome del package dell'applicazione.
  * @param pkg {ApplicationPackage} package dell'applicazione da aggiungere.
  * @return {ErrorObservable} //ritorno un Observable che registra l'applicazione nel ApplicationLocalRegistry e successivamente chiama la complete dell'Observer iscritto
  */
  register(name, pkg)
  {
    let self = this;
    return new Rx.Observable(function(observer)
    {
      self.registry.register(name, pkg);
      observer.complete();
    });
  }

  /**
  * Metodo utilizzato per ottenere il package di un'applicazione.
  * @param name {String} nome del package dell'applicazione da ottenere.
  * @return {ApplicationPackageObservable} ritorno un Observable che interroga l'ApplicationLocalRegistry, successivamente chiama la next dell'Observer iscritto con i dati ottenuti e la complete.
  */
  query(name)
  {
    let self = this;

    return new Rx.Observable(function(observer)
    {
      let app = self.registry.query(name);

      observer.next(app);
      observer.complete();
    });
  }
}
