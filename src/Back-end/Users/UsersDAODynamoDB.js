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
    return new Rx.Observable(function(observer){
      let params = {TableName: this.table, Item: user};
      this.client.put(params, function(err, data){
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
    return new Rx.Observable(function(observer){
      let params = {
        TableName: self.table,
        Key: {
          HashKey: username
        }
      };
      self.client.get(params, function(err, data){
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

  }

  removeUser(username)
  {

  }

  updateUser(user)
  {

  }
}

module.exports = UsersDAODynamoDB;
