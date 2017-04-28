class Manager
{
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
      if (new_app === null)
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
      //eseguo il comando nell'applicazione istanziata
      this.application.runCmd(cmd, params);
  }

  setFrame(frame)
  {
    let list=document.getElementById("mainFrame");
    list.parentNode.removeChild(list);
    this.frame.appendChild(frame);
  }

  _changeApplication(app)
  {
    //salvo l'applicazione da sostituire nello state
    this.state.addApp(this.application, this.application.name);
    //elimino il div contenente l'applicazione
    this.frame.removeChild(this.ui);

    this.application = app;
    //aggiungo un div con la nuova applicazione da istanziare
    let new_ui = this.application.getUI();
    this.ui = new_ui;

    this.frame.appendChild(this.ui);
  }

}

module.exports = Manager;
