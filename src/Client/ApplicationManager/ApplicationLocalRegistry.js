class ApplicationLocalRegistry
{
  constructor()
  {
    this.pkgs = new Array();
  }

  query(name)
  {
    return pkgs[name];
  }

  register(name, pkg)
  {
    pkgs[name] = pkg;
  }

  remove(name)
  {
    delete pkgs[name];
  }

}

module.exports = ApplicationLocalRegistry;
