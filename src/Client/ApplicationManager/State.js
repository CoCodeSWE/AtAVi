class State
{
  constructor()
  {
    this.apps = new Array();
  }

  addApp(app, name)
  {
    apps[name] = app;
  }

  getApp(name)
  {
    return apps[name];
  }
}

module.exports = State;
