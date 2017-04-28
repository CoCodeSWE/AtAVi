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
  getUserList(query)
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
				if(Object.keys(filter_expression) > 0)
				{
					params.FilterExpression = filter_expression.FilterExpression;
					params.ExpressionAttributeValues = filter_expression.ExpressionAttributeValues;
				}
			}
				
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

/*
Ritorna un oggetto contenente FilterExpression (striga) e ExpressionAttributeValues (object).
*/
function filterExpression(obj)
{
	let init =
	{
		FilterExpression: '',
		ExpressionAttributeValues: {}
	}
	
	let filter_expression = Object.keys(obj).reduce(function(expression, key)
	{
		expression.FilterExpression += `${key} = :${key},`;
		expression.ExpressionAttributeValues[`:${key}`] = obj[key];
		return expression;
	}, init);
	
	// Tolgo la virgola finale dal FilterExpression
	filter_expression.FilterExpression = filter_expression.FilterExpression.slice(0,-1);
	
	return filter_expression;
}

module.exports = UsersDAODynamoDB;
