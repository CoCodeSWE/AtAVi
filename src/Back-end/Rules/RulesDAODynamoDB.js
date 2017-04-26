const Rx = require('rxjs/Rx');

class RulesDAODynamoDB
{
  constructor(client)
  {
    this.client = client;
    this.table = 'Rules';
  }

  //aggiunge una nuova rule in DynamoDB
  addRule(rule)
  {
    let self = this;
    return new Rx.Observable(function(observer){
      let params =
      {
        'TableName': this.table,
        'Item': rule
      };
      self.client.put(params, function(err, data)
      {
        if(err)
          observer.error(err);
        else
          observer.complete();
      });
    });
  }

  //ottine una rule in DynamoDB tramite l'id
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
          'HashKey': id
        }
      };
      self.client.get(params, function(err, data)
      {
        if(err)
          observer.error(err);
        else if(!data.id)
  				observer.error('Not found');
        else
        {
          observer.next();
          observer.complete();
        }
      });
    });
  }

  //ottiene la lista delle rule in DynamoDB
  getRuleList()
  {
    let self = this;
    return new Rx.Observable(function(observer)
    {
      let params = {TableName: self.table};
      self.client.scan(params, onScan(observer, self));
    });
  }

  //rimuove una rule da DynamoDB
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
          'HashKey': id
        },
        ConditionExpression: 'attribute_exists(HashKey)'
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

  query(target,stringarray = null)
  {
    let self = this;
    return new Rx.Observable(function(observer)
    {
      let params =
      {
        TableName: self.table
        FilterExpression: 'target CONTAINS :target_value'
        ExpressionAttributeValues:
        {
          ':target_value': target
        }
      };
      self.client.scan(params, onScan(observer, self));
    });
  }

  //aggiorna una rule su DynamoDB
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
          'HashKey': rule.id
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

// Viene ritornata la funzione di callback per la gesitone dei blocchi di getRuleList e query
function onScan(observer, rules)
{
	return function(err, data)
	{
		if(err)
			observer.error(err);
		else
		{
			observer.next(data);
			if(data.LastEvaluatedKey)
			{
				let params =
				{
					TableName: rules.table,
					ExclusiveStartKey: data.LastEvaluatedKey
				};
				rules.client.scan(params, onScan(observer, rules));
			}
			else
			{
				observer.complete();
			}
		}
	}
}

module.exports = RulesDAODynamoDB;
