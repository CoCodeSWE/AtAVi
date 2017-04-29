class ApplicationLocalRegistry
{
  /**
  * Costruttore della classe che si occupa di mantenere una lista degli ApplicationPackage disponibili.
  */
  constructor()
  {
    this.pkgs = new Array();
  }

  /**
  * Metodo utilizzato per ottenere il package di un'applicazione.
  * @param name {String} nome del package dell'applicazione da ottenere.
  * @return {ApplicationPackage} package dell'applicazione corrispondente al name.
  */
  query(name)
  {
    return this.pkgs[name];
  }

  /**
  * Metodo utilizzato per aggiungere, o aggioranre, un package di un'applicazione nel registro.
  * @param name {String} nome del package dell'applicazione da aggiungere.
  * @param pkg {ApplicationPackage} package dell'applicazione da aggiungere.
  */
  register(name, pkg)
  {
    this.pkgs[name] = pkg;
  }

  /**
  * Metodo utilizzato per rimuovere un package di un'applicazione dal registro.
  * @param name {String} nome del package dell'applicazione da rimuovere.
  */
  remove(name)
  {
    delete this.pkgs[name];
  }

}
