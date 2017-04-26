class ApplicationRegistryLocalClient
{
  constructor(client)
  {
    this.registry = client;
  }

  register(name, pkg)
  {
    let self = this;
    return new Rx.Observable(function(observer)
    {
      self.registry.register(name, pkg);
      observer.complete();
    });
  }

  query(name)
  {
    return registry.query(name);
  }

}

module.exports = ApplicationRegistryLocalClient;
