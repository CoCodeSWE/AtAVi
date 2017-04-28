const Rx = require('rxjs/Rx');

class TasksDAODynamoDB
{
  constructor(client)
  {
    this.client = client;
    this.table = 'Tasks';
  }

  //aggiunge un task a DynamoDB
  addTask(task)
  {
    let self = this;
    return new Rx.Observable(function(observer){
      let params =
      {
        TableName: this.table,
        Item: task
      };
      self.client.put(params, function(err, data){
        if(err)
          observer.error(err);
        else
          observer.complete();
      });
    });
  }
  //ottiene un task da DynamoDB
  getTask(type)
  {
    let self = this;
    return new Rx.Observable(function(observer)
    {
      let params =
      {
        TableName: self.table,
        Key:
        {
          HashKey: type // un task è identificato dal nome del suo tipo
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
  //ottiene la lista dei task in DynamoDB, suddivisi in blocchi da massimo 1 MB
  getTaskList(query)
  {
    let self = this;
    return new Rx.Observable(function(observer)
    {
      let params =
      {
        TableName: self.table
      };

      // Controllo se gli user da restituire hanno dei filtri (contenuti in query)
      if(query)
      {
        let filter_expression = filterExpression(query);
        if(Object.keys(filter_expression).length > 0)
        {
          params.FilterExpression = filter_expression.FilterExpression;
          params.ExpressionAttributeValues = filter_expression.ExpressionAttributeValues;
        }
      }
      self.client.scan(params, self._onScan(observer, params));
    });
  }
  //rimuove un task da DynamoDB
  removeTask(type)
  {
    let self = this;
    return new Rx.Observable(function(observer)
    {
      let params =
      {
        TableName: self.table,
        Key:
        {
          HashKey: type
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
  //aggiorna un task su DynamoDB
  updateTask(task)
  {
    let self = this;
    return new Rx.Observable(function(observer)
    {
      let params =
      {
        TableName: self.table,
        Key:
        {
          HashKey: task.type
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





  // Viene ritornata la funzione di callback per la gesitone dei blocchi di getTaskList
  _onScan(observer, tasks)
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
  					TableName: tasks.table,
  					ExclusiveStartKey: data.LastEvaluatedKey
  				};
  				rules.client.scan(params, onScan(observer, tasks));
  			}
  			else
  			{
  				observer.complete();
  			}
  		}
  	}
  }
}

// Ritorna un oggetto contenente FilterExpression (stringa) e ExpressionAttributeValues (object).
function filterExpression(obj)
{
	let filter_expression =
	{
		FilterExpression: '',
		ExpressionAttributeValues: {}
	};

  let new_obj = {};

  for(let i in obj)
  {
    let key = attr_map[i] ? attr_map[i] : i;  // calcolo il valore della nuova key che, nel caso in cui non esista una mappatura, sarà uguale alla vecchia
    new_obj[key] = obj[i];  // assegno il valore che aveva obj[i] con la vecchia key a new_obj[key] con la nuova key.
  };

  for(let key in new_obj)
  {
    filter_expression.FilterExpression += `${key} = :${key} and `;
		filter_expression.ExpressionAttributeValues[`:${key}`] = new_obj[key];
  }

	// Tolgo l'and finale dal FilterExpression
	filter_expression.FilterExpression = filter_expression.FilterExpression.slice(0,-5);
  return filter_expression;
}

// probabilmente da modificare
const attr_map =
{
  name: 'full_name'
}

module.exports = TasksDAODynamoDB;
