import Rx from 'rxjs/Rx';

/**
* @desc Questa classe si occupa di implementare l'interfaccia fornita da ApplicationRegistryClient. Interroga un LocalRegistry.
*/
export default class ApplicationRegistryLocalClient
{
  /**
  * Costruttore del registro che interroga l'ApplicationLocalRegistry.
  * @param {ApplicationLocalRegistry} client registro contenente i package delle applicazioni diponibili. Ne facciamo qui la dependency injection.
  */
  constructor(registry)
  {
    /**
    * @type {ApplicationLocalRegistry}
    */
    this.registry = registry;
  }

  /**
  * Metodo utilizzato per aggiungere o aggiornare il package di una applicazione.
  * @param {String} name nome del package dell'applicazione.
  * @param {ApplicationPackage} pkg package dell'applicazione da aggiungere.
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
  * @param {String} name nome del package dell'applicazione da ottenere.
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
