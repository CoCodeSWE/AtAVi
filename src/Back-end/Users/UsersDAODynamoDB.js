const Rx = require('rxjs/Rx');

class UsersDAODynamoDB
{
  constructor(client)
  {
    this.client = client;
    this.table = process.env.USERS_TABLE;
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
				console.log('query');
				let filter_expression = filterExpression(query);
				console.log(filter_expression);
				if(Object.keys(filter_expression).length > 0)
				{
					params.FilterExpression = filter_expression.FilterExpression;
					params.ExpressionAttributeValues = filter_expression.ExpressionAttributeValues;
				}
			}
			console.log(params);
			self.client.scan(params, self._onScan(observer, params));
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
	
	// Viene ritornata la funzione di callback per la gesitone dei blocchi di getUserList
	_onScan(observer, params)
	{
		let self = this;
		return function(err, data)
		{
			if(err)
			{
				observer.error(err);
			}
			else
			{
				observer.next(data);
				if(data.LastEvaluatedKey)
				{
					params.ExclusiveStartKey = data.LastEvaluatedKey;
					self.client.scan(params, self._onScan(observer, params));
				}
				else
				{
					observer.complete();
				}
			}
		}
	}
}

// Ritorna un oggetto contenente FilterExpression (striga) e ExpressionAttributeValues (object).
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

const attr_map =
{
  name: 'full_name'
}

module.exports = UsersDAODynamoDB;
