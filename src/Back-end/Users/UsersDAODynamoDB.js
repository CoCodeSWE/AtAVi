const Rx = require('rxjs/Rx');

class UsersDAODynamoDB
{
  constructor(client)
  {
    this.client = client;
    this.table = 'Users';
  }

  addUser(user)
  {
    let self = this;
    return new Rx.Observable(function(observer)
		{
      let params =
			{
				TableName: self.table,
				Item: user
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

  getUser(username)
  {
    let self = this;
    return new Rx.Observable(function(observer)
    {
      let params =
      {
        TableName: self.table,
        Key:
        {
          'username': username
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

  getUserList()
  {
		let self = this;
		return new Rx.Observable(function(observer)
		{
			// Per non usare la ricorsione uso una variabile booleana (lastEvaluatedKey) che mi dice se il blocco ricevuto da scan è l'ultimo o meno
			let lastEvaluatedKey = true;
			
			let params =
			{
				TableName: self.table
			};
			
			do
			{
				self.client.scan(params, function(err, data)
				{
					if(err)
						observer.error(err);
					else
					{
						observer.next(data);
						if(!data.LastEvaluatedKey)
						{
							//Terminati i blocchi e quindi notifico l'Observer con il suo metodo complete
							lastEvaluatedKey = false;
							observer.complete();
						}
						else
						{
							//Params per il prossimo blocco
							params =
							{
								TableName: self.table,
								ExclusiveStartKey: data.lastEvaluatedKey
							};
						}
					}
				});
			}
			while(lastEvaluatedKey);
		});
  }

  removeUser(username)
  {
		let self = this;
		return new Rx.Observable(function(observer)
		{
			let params = 
			{
				TableName: self.table,
				Key:
				{
					'username': username
				}
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

	//Da rivedere
  updateUser(user)
  {
		let self = this;
		return new Rx.Observable(function(observer)
		{
			let params =
			{
				TableName: self.table,
				Key:
				{
					'username': user.username
				}
				UpdateExpression: 'set name = :name, password = :password, slack_channel = :slack_channel, sr_id = :sr_id',
				ExpressionAttributeValues:
				{
					':name': user.name,
					':password': user.password,
					':slack_channel': user.slack_channel,
					':sr_id': user.sr_id
				},
				ReturnValues: 'UPDATED_NEW'
			}
									
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

module.exports = UsersDAODynamoDB;
