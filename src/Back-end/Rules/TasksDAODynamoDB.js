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
  //ottiene la lista dei task da DynamoDB
  getTaskList()
  {
    let self = this;
    return new Rx.Observable(function(observer)
    {
      let params = {TableName: self.table};
      self.client.scan(params, onScan(observer, self));
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
}




// Viene ritornata la funzione di callback per la gesitone dei blocchi di getTaskList
function onScan(observer, tasks)
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
					'TableName': tasks.table,
					'ExclusiveStartKey': data.LastEvaluatedKey
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
module.exports = TasksDAODynamoDB;
