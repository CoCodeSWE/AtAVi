class State
{
  constructor()
  {
    this.apps = new Array();
  }

  addApp(app, name)
  {
    this.apps[name] = app;
  }

  getApp(name)
  {
    return this.apps[name];
  }
}
