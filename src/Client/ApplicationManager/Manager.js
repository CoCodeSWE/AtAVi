class Manager
{
  constructor(rc, frame)
  {
    this.registry_client = rc;
    this.frame = frame;
    this.state = new State();
    this.application = new Application();
  }

  //metodo che permette di invocare un comando sull'applicazione passata come parametro
  runApplication(app, cmd, params)
  {
    //se l'applicazione istanziata non è quella desiderata, devo cambiarla salvando nello state quella attuale e istanziando l'applicazione richiesta
    if (this.application.name !== app)
    {
      var new_app = state.getApp(app);

      //se non si trova nello state devo recuperarla dall'ApplicationRegistryLocalClient tramite il metodo query()
      if (new_app === undefined)
        new_app = new Application(registry_client.query(app));

      state.addApp(this.application, application.name);

      this.application = new_app;
      frame.appendChild(new_app.getUi());
    }

    //eseguo il comando nell'applicazione istanziata
    this.application.runCmd(cmd, params);
  }

  setFrame(frame)
  {
    this.frame.removeChild(this.frame.lastChild);
    this.frame.appendChild(frame);
  }

}

module.exports = Manager;
