const Rx = require('rxjs/Rx');

class RulesDAODynamoDB
{
  constructor(client)
  {
    this.client = client;
    this.table = 'Rules';
  }

  addRule(rule)
  {
    let self = this;
    return new Rx.Observable(function(observer){
      let params = {TableName: this.table, Item: rule};
      self.client.put(params, function(err, data)
      {
        if(err)
          observer.error(err);
        else
          observer.complete();
      });
    });
  }

  getRule(id)
  {
    let self = this;
    return new Rx.Observable(function(observer)
    {
      let params =
      {
        TableName: self.table,
        Key:
        {
          HashKey: id
        }
      };
      self.client.get(params, function(err, data)
      {
        if(err)
          observer.error(err);
        else
        {
          observer.next();
          observer.complete();
        }
      });
    });
  }

  getRuleList()
  {
    let self = this;
    return new Rx.Observable(function(observer)
    {
      let params = {TableName: self.table};
      self.client.scan(params, function(err, data)
      {
        if(err)
          observer.error(err);
        else
        {
          observer.next(data);
          observer.complete();
        }
      });
    });
  }

  removeRule(id)
  {
    let self = this;
    return new Rx.Observable(function(observer)
    {
      let params =
      {
        TableName: self.table,
        Key:
        {
          HashKey: id
        }
      };
      self.client.delete(params, function(err, data)
      {
        if(err)
          observer.error(err);
        else
          observer.complete();
      });
    });
  }

  updateRule(rule)
  {
    let self = this;
    return new Rx.Observable(function(observer)
    {
      let params =
      {
        TableName: self.table,
        Key:
        {
          HashKey: rule.id
        }
      };
      self.client.update(params, function(err, data)
      {
        if(err)
          observer.error(err);
        else
        {
          observer.next(data);
          observer.complete();
        }
      });
    });
  }
}

module.exports = RulesDAODynamoDB;
