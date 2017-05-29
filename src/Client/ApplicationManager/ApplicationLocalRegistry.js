/**
* @desc Questa classe si occupa di implementare l'interfaccia WebhookService, realizzando un Webhook che fornisce una risposta all'Agent di amministrazione.
* @author Mauro Carlin
* @version 0.0.7
* @since 0.0.3-alpha
*/
export default class ApplicationLocalRegistry
{
  /**
  * Costruttore della classe che si occupa di mantenere una lista degli ApplicationPackage disponibili.
  */
  constructor()
  {
    /**
    * @type {ApplicationPackageArray}
    */
    this.pkgs = [];
  }

  /**
  * Metodo utilizzato per ottenere il package di un'applicazione.
  * @param {String} name nome del package dell'applicazione da ottenere.
  * @return {ApplicationPackage} package dell'applicazione corrispondente al name.
  */
  query(name)
  {
    console.log("registro più interno query con "+name);
    console.log("ritorno ",this.pkgs[name]);
    return this.pkgs[name];
  }

  /**
  * Metodo utilizzato per aggiungere, o aggioranre, un package di un'applicazione nel registro.
  * @param {String} name nome del package dell'applicazione da aggiungere.
  * @param {ApplicationPackage} pkg package dell'applicazione da aggiungere.
  */
  register(name, pkg)
  {
    console.log("registro: "+name);
    this.pkgs[name] = pkg;
    console.log("lunghezza: ",this.pkgs.length);
  }

  /**
  * Metodo utilizzato per rimuovere un package di un'applicazione dal registro.
  * @param {String} name nome del package dell'applicazione da rimuovere.
  */
  remove(name)
  {
    delete this.pkgs[name];
  }

}
