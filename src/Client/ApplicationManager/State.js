export default class State
{
  /**
  * Costruttore dello State che si occupa di salvare lo stato attuale delle applicazioni la cui esecuzione vuole essere sospesa.
  */
  constructor()
  {
    this.apps = new Array();
  }

  /**
  * Metodo utilizzato per aggiungere, o aggiornare, lo stato di una applicazione nello State.
  * @param {Application} app applicazione da aggiungere.
  * @param {String} name nome dell'applicazione da utilizzare come chiave dell'array associativo.
  */
  addApp(app, name)
  {
    this.apps[name] = app;
  }

  /**
  * Metodo utilizzato per ottenere una applicazione dallo State.
  * @param {String} name nome dell'applicazione da ottenere.
  * @return {Application} applicazione corrispondente al parametro name.
  */
  getApp(name)
  {
    return this.apps[name];
  }
}
