const Rx = require('rxjs/Rx');
var AWS = require("aws-sdk");

// configurazione di prova
/*// #####
AWS.config.update({
    region: "us-west-2",
    endpoint: "http://localhost:8000"
});
// ##### */

class AgentsDAODynamoDB
{
  constructor(client)
  {
    this.client = client;
    this.table = 'Agents';
  }

  addAgent(agent)
  {
    let self = this;
    return new Rx.Observable(function(observer){
      let params = {TableName: this.table, Item: agent};
      self.client.put(params, function(err, data){
        if(err)
          observer.error(err);
        else
          observer.complete();
      });
    });
  }

  getAgent(name)
  {
    let self = this;
    return new Rx.Observable(function(observer)
    {
      let params =
      {
        TableName: self.table,
        Key:
        {
          HashKey: name // un agent è identificato dal suo nome
        }
      };
      self.client.get(params, function(err, data)
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

  getAgentList()
  {
    let self = this;
    return new Rx.Observable(function(observer)
    {
      let params = {TableName: self.table};
      self.client.scan(params, onScan);
      function onScan(err, data){
          if(err)
              observer.error(err);
          else
          {
              observer.next(data);
              if (typeof data.LastEvaluatedKey != "undefined") {
                  params.ExclusiveStartKey = data.LastEvaluatedKey;
                  self.client.scan(params, onScan);
              }else
                  observer.complete();
          }
      }
    });
  }

  removeAgent(name)
  {
    let self = this;
    return new Rx.Observable(function(observer)
    {
      let params =
      {
        TableName: self.table,
        Key:
        {
          HashKey: name
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

  updateAgent(rule)
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

/* Un codice di test veloce
var a = new AgentsDAODynamoDB(new AWS.DynamoDB.DocumentClient());
a.getAgentList().subscribe(
  x => console.log('onNext: '+ x),
  e => console.log('onError: '+ e),
  () => console.log('onCompleted')
);
*/
module.exports = AgentsDAODynamoDB;
