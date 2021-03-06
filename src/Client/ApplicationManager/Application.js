/**
* @desc Questa classe si occupa della gestione dell'applicazione in esecuzione. È una classe astratta.
* @author Nicola Tintorri
* @version 0.0.4
* @since 0.0.3-alpha
*/
export default class Application
{
  /**
  * Costruttore che permette di istanziare un'aplicazione a partire dal suo package.
  * @param {ApplicationPackage} pkg - Pacchetto contenente le informazioni necessarie all'istanziazione dell'applicazione.
  */
  constructor(pkg)
  {
    let self = this;
    this.name = pkg.name;
    this.ui = document.createElement('div');
    this.ui.innerHTML = pkg.ui;
    this._loadLibs(pkg.libs);
    this._onload = []; //array di callback da chiamare quando l'applicazione è istanziata
    this._onload.push(function()
    {
      ((new Function(pkg.setup)).apply(self)); //creo funzione costruttore, faccio binding con this e la chiamo
      self.runCmd = (new Function("cmd", "params", pkg.cmdHandler)).bind(self);
    });
  }

   /**
   * metodo che si occupa di caricare le librerie necessarie all'applicazione una alla volta
   * @param {StringArray} libs - lista delle librerie che servono all'applicazione per funzionare
   */
  _loadLibs(libs)
  {
    let cur;
    if(libs[0])
    {
      let script = document.createElement('script');
      script.src = libs[0];
      script.onload = this._loadLibs.bind(this, libs.slice(1)); //quando lo script corrente è caricato, carico la prossima lib.
                                                                //in questo modo se ci sono dipendenze tra script li carico uno alla volta ed evito
                                                                //che fallisca il caricamento di uno di essi, perchè vengono caricati nell'ordine
                                                                //in cui sono scritti nel file.
      this.ui.appendChild(script);
    }
    else
    {
      this._onload.forEach((cb) => {cb();});
      this._onload = [];
    }
  }
  /**
  * metodo che permette di ottenere il nodo relativo all'interfaccia grafica dell'applicazione da appendere al DOM
  */
  getUI()
  {
    return this.ui;
  }


  /**
   * setter che permette di aggiungere una funzione di callback che verrà chiamata
   * una volta caricata l'applicazione
   * @param {function} cb - callback da chiamare una volta finita di caricare l'applicazione
   */
  set onload(cb)
  {
    console.log('cb')
    if(typeof(cb) === 'function') //controllo che mi sia passata effettivamente una funzione
      this._onload.push(cb);
  }
}
