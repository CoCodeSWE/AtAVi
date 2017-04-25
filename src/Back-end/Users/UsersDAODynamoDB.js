const Rx = require('rxjs/Rx');

class UsersDAODynamoDB
{
  constructor(client)
  {
    this.client = client;
    this.table = 'Users';
  }

	// Aggiunge un nuovo user in DynamoDB
  addUser(user)
  {
    let self = this;
    return new Rx.Observable(function(observer)
		{
      let params =
			{
				'TableName': self.table,
				'Item': user
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

	// Ottiene l'user avente l'username passato come parametro
  getUser(username)
  {
    let self = this;
    return new Rx.Observable(function(observer)
    {
      let params =
      {
        'TableName': self.table,
        'Key':
        {
          'username': username
        }
      };
      self.client.get(params, function(err, data)
      {
        if(err)
          observer.error(err);
				else if(!data.username)
					observer.error('Not found');
        else
        {
          observer.next(data);
          observer.complete();
        }
      });
    });
  }

	// Ottiene la lista degli user in DynamoDB, suddivisi in blocchi (da massimo da 1MB)
  getUserList()
  {
		let self = this;
		return new Rx.Observable(function(observer)
		{
			let params =
			{
				TableName: self.table
			};
			self.client.scan(params, onScan(observer, self));
		});
  }
	
	// Elimina l'user avente l'username passato come parametro
  removeUser(username)
  {
		let self = this;
		return new Rx.Observable(function(observer)
		{
			let params = 
			{
				'TableName': self.table,
				'Key':
				{
					'username': username
				},
				ConditionExpression: 'attribute_exists(username)'
			}
			self.client.delete(params, function(err, data)
			{
				if(err)
					observer.error(err);
				else
					observer.complete();
			});
		});
  }

	// Aggiorna l'user passato come parametro (se non c'è lo crea)
  updateUser(user)
  {
		let self = this;
    return new Rx.Observable(function(observer)
		{
      let params =
			{
				'TableName': self.table,
				'Item': user
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
}

// Viene ritornata la funzione di callback per la gesitone dei blocchi di getUserList
function onScan(observer, users)
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
					'TableName': users.table,
					'ExclusiveStartKey': data.LastEvaluatedKey
				};
				users.client.scan(params, onScan(observer, users));
			}
			else
			{
				observer.complete();
			}
		}
	}
}

module.exports = UsersDAODynamoDB;
