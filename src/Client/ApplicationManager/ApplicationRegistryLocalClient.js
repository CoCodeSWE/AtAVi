class ApplicationRegistryLocalClient
{
  constructor(client)
  {
    this.registry = client;
  }

  register(name, pkg)
  {
    registry.register(name, pkg);
  }

  query(name)
  {
    var app_pkg = registry.query(name);
  }

}

module.exports = ApplicationRegistryLocalClient;
