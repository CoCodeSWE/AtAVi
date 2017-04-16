const Rx = require('rxjs/Rx');

class guestsDAODynamoDB
{
  constructor(client)
  {
    this.client = client;
    this.table = 'Guests';
  }

  addGuest(guest)
  {
    let self = this;
    return new Rx.Observable(function(observer)
    {
      let params = {TableName: this.table, Item: guest};
      this.client.put(params, function(err, data)
      {
        if(err)
          observer.error(err);
        else
          observer.complete();
      });
    });
  }

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
      this.client.get(params, function(err, data)
      {
        if(err)
          observer.error(err);
        else
          observer.complete();
      });
    });
  }

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
      this.client.delete(params, function(err, data)
      {
        if(err)
          observer.error(err);
        else
          observer.complete();
      });
    });
  }
}

module.exports = guestsDAODynamoDB;
