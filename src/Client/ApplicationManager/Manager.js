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
    //se l'applicazione instanziata non è quella desiderata, devo cambiarla salvando nello state quella attuale e instanziando l'applicazione richiesta
    if (this.application.name !== app)
    {
      var new_app = state.getApp(app);

      if (new_app === undefined)
        new_app = new Application(registry_client.query(app));

      state.addApp(this.application, application.name);

      this.application = new_app;
      frame.appendChild(new_app.getUi());
    }

    //eseguo il comando nell'applicazione instanziata
    this.application.runCmd(cmd, params);
  }

  setFrame(frame)
  {
    this.frame.removeChild(this.frame.lastChild);
    this.frame.appendChild(frame);
  }

}

module.exports = Manager;
