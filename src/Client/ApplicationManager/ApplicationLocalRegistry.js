class ApplicationLocalRegistry
{
  constructor()
  {
    this.pkgs = new Array();
  }

  query(name)
  {
    return this.pkgs[name];
  }

  register(name, pkg)
  {
    this.pkgs[name] = pkg;
  }

  remove(name)
  {
    delete this.pkgs[name];
  }

}

module.exports = ApplicationLocalRegistry;
