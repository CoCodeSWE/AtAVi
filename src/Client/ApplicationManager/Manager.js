/**
* @desc Questa classe si occupa di gestire il cambio delle applicazioni nel client.
* @author Simeone Pizzi
* @version 0.0.6
* @since 0.0.3-alpha
*/
import State from './State';
import Application from './Application';
export default class Manager
{
  /**
  * Costruttore del manager che si occupa di gestire le applicazioni istanziate.
  * @param {ApplicationRegistryLocalClient} rc registro che gestisce i package delle applicazioni. Ne effettuiamo qui la dependency injection.
  * @param {HTMLElement} frame pagina HTML iniziale del nostro sistema.
  */
  constructor(rc, frame)
  {
    this.registry_client = rc;
    this.frame = frame;
    this.state = new State();
    this.application = null;
    this.application_name = '';
    this.ui = null;
  }

  /**
  * Metodo che permette di invocare un comando sull'applicazione passata come parametro.
  * @param {String} app - nome dell'applicazione sulla quale invocare il comando.
  * @param {String} cmd - comando da invocare.
  * @param {ResponseBody} params - parametro contenente l'insieme dei dati relativi alla risposta ricevuta.
  * @param {String} [name=null] - parametro che indica il nome dell'applicazione. Se null verrà utilizzato il nome
  * presente all'interno del package
  */
  runApplication(app, cmd, params, name)
  {
    console.log('params: ', app, cmd, params, name);
    let self = this;
    //se l'applicazione istanziata non è quella desiderata, devo cambiarla salvando nello state quella attuale e istanziando l'applicazione richiesta
    if(!name || typeof(name) !== 'string')
      name = app;
    if (this.application_name !== app)
    {
      let new_app = this.state.getApp(app);
      // se non si trova nello state devo recuperarla dall'ApplicationRegistryLocalClient tramite il metodo query()
      if (new_app === undefined)
      {
        self.registry_client.query(app).subscribe(
        {
          next: function(pkg)
          {
            console.log("PACKAGE", pkg);
            if(!pkg.setup)  // package parziale, interfaccia condivisa con un'altra applicazione
            {
              self.runApplication(pkg.name, cmd, params, name);
            }
            else
            {
              new_app = new Application(pkg);
              self.application_name = name; //cambio il nome dell'applicazione attualmente in esecuzione.
              self._changeApplication(new_app);
              new_app.onload = function()
              {
                //in questo modo se viene richiesta nuovamente l'esecuzione di un'azione da parte di
                //quella applicazione non interrogo nuovamente il registry. L'idea  è che una volta in esecuzione
                //un'applicazione dovrà eseguire una serie di azioni prima di essere cambiata.
                self.application.runCmd(cmd, params);
              }
            }
          },
          error: (err) => { console.log(err); },
          complete : function(){}
        });
      }
      else
      {
        this.application_name = name; // applicazione attualmente in esecuzione
        this._changeApplication(new_app);
        this.application.runCmd(cmd, params);
      }
    }
    else
    {
      this.application_name = name;
      this.application.runCmd(cmd, params);
    }
  }

  /**
  * Metoso utilizzato per modificare il frame presente nel manager.
  * @param {HTMLElement} frame parametro che contiene l'elemento del DOM.
  */
  setFrame(frame)
  {
    this.frame.removeChild(this.ui);
    this.frame = frame;
    this.frame.appendChild(this.ui);
  }

  /**
  * Metodo utilizzato per cambiare l'applicazione istanziata.
  * @param {Application} app nuova applicazione da istanziare.
  */
  _changeApplication(app)
  {
    //salvo l'applicazione da sostituire nello state
    this.state.addApp(app, this.application_name);
    //elimino il div contenente l'applicazione
    if(this.ui)
      this.frame.removeChild(this.ui);

    this.application = app;
    //aggiungo la nuova applicazione da istanziare al frame HTML
    this.ui = this.application.getUI();
    this.frame.appendChild(this.ui);
  }

  resetState()
  {
    this.state = new State();
  }
}
