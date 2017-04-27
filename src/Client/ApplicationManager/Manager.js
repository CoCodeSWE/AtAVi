class Manager
{
  //aggiungere ui per togliere e aggiungere, arlc è asincrono, cambiare anche test
  constructor(rc, frame)
  {
    this.registry_client = rc;
    this.frame = frame;
    this.state = new State();
    this.application = null;
    this.ui = null;
  }

  //metodo che permette di invocare un comando sull'applicazione passata come parametro
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
            this.state.addApp(this.application, application.name);
            this.frame.removeChild(this.ui);
            this.application = new_app;
            let new_ui = this.application.getUI();
            this.ui = new_ui;
            this.frame.appendChild(this.ui);
            this.application.runCmd(cmd, params);
          }
        });
      }
      else
      {
        this.state.addApp(this.application, application.name);
        this.frame.removeChild(this.ui);
        this.application = new_app;
        let new_ui = this.application.getUI();
        this.ui = new_ui;
        this.frame.appendChild(this.ui);
      }
    }

    //eseguo il comando nell'applicazione istanziata
    this.application.runCmd(cmd, params);
  }

  setFrame(frame)
  {
    this.frame.removeChild(this.ui);
    this.ui = frame;
    this.frame.appendChild(frame);
  }

}

module.exports = Manager;
