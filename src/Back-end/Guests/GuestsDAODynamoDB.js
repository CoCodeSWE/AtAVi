const Rx = require('rxjs/Rx');

class guestsDAODynamoDB
{
  constructor(client)
  {
    this.client = client;
    this.table = 'Guests';
  }
  // aggiunge una guest a DynamoDB
  addGuest(guest)
  {
    let self = this;
    return new Rx.Observable(function(observer)
    {
      let params =
      {
        TableName: self.table,
        Item: guest
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
  // ottiene una guest da DynamoDB
  getGuest(name)
  {
    let self = this;
    return new Rx.Observable(function(observer)
    {
      let params = {
        TableName: self.table,
        Key: {
          "name": name
        }
      };
      self.client.get(params, function(err, data)
      {
        if(err)
          observer.error(err);
        else
          observer.complete();
      });
    });
  }
  // rimuove una guest da DynamoDB
  removeGuest(name)
  {
    let self = this;
    return new Rx.Observable(function(observer)
    {
      let params = {
        TableName: self.table,
        Key: {
          "name": name
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

  //ottiene la lista delle guest da DynamoDB
  getGuestList()
  {
    let self = this;
    return new Rx.Observable(function(observer)
    {
      let params = {TableName: self.table};
      self.client.scan(params, onScan(observer, self));
    });
  }

  //aggiorna una guest su DynamoDB
  updateGuest(guest)
  {
    let self = this;
    return new Rx.Observable(function(observer)
    {
      let params =
      {
        TableName: self.table,
        Item: guest
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

// Viene ritornata la funzione di callback per la gesitone dei blocchi di getGuestList
function onScan(observer, guests)
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
					TableName: guests.table,
					ExclusiveStartKey: data.LastEvaluatedKey
				};
				rules.client.scan(params, onScan(observer, guests));
			}
			else
			{
				observer.complete();
			}
		}
	}
}

module.exports = guestsDAODynamoDB;
