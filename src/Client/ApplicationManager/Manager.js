class Manager
{
  /**
  * Costruttore del manager che si occupa di gestire le applicazioni istanziate.
  * @param rc {ApplicationRegistryLocalClient} registro che gestisce i package delle applicazioni. Ne effettuiamo qui la dependency injection.
  * @param frame {HTMLElement} pagina HTML iniziale del nostro sistema.
  */
  constructor(rc, frame)
  {
    this.registry_client = rc;
    this.frame = frame;
    this.state = new State();
    this.application = null;
    this.ui = null;
  }

  /**
  * Metodo che permette di invocare un comando sull'applicazione passata come parametro.
  * @param app {String} nome dell'applicazione sulla quale invocare il comando.
  * @param cmd {String} comando da invocare.
  * @param params {ResponseBody} parametro contenente l'insieme dei dati relativi alla risposta ricevuta.
  */
  runApplication(app, cmd, params)
  {
    //se l'applicazione istanziata non è quella desiderata, devo cambiarla salvando nello state quella attuale e istanziando l'applicazione richiesta
    if (this.application.name !== app)
    {
      let new_app = this.state.getApp(app);

      //se non si trova nello state devo recuperarla dall'ApplicationRegistryLocalClient tramite il metodo query()
      if (new_app === undefined)
      {
        registry_client.query(app).subscribe(
        {
          next: (data) => { new_app = new Application(data); },
          error: (err) => { error(err); },
          complete: () =>
          {
            _changeApplication(new_app);

            this.application.runCmd(cmd, params);
          }
        });
      }
      else
      {
        _changeApplication(new_app)

        this.application.runCmd(cmd, params);
      }
    }
    else
      this.application.runCmd(cmd, params);
  }

  /**
  * Metoso utilizzato per modificare il frame presente nel manager.
  * @param frame {HTMLElement} parametro che contiene l'elemento del DOM.
  */
  setFrame(frame)
  {
    this.frame.removeChild(this.ui);
    this.frame = frame;
    this.frame.appendChild(this.ui);
  }

  /**
  * Metodo utilizzato per cambiare l'applicazione istanziata.
  * @param app {Application} nuova applicazione da istanziare.
  */
  _changeApplication(app)
  {
    //salvo l'applicazione da sostituire nello state
    this.state.addApp(this.application, this.application.name);
    //elimino il div contenente l'applicazione
    this.frame.removeChild(this.ui);

    this.application = app;
    //aggiungo la nuova applicazione da istanziare al frame HTML
    this.ui = this.application.getUI();
    this.frame.appendChild(this.ui);
  }

}

module.exports = Manager;
