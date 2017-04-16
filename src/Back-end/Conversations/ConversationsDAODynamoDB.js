const Rx = require('rxjs/Rx');

class ConversationsDAODynamoDB
{
  constructor(client)
  {
    this.client = client;
    this.table = 'Conversations';
  }

  addConversation(conv)
  {
    let self = this;
    return new Rx.Observable(function(observer){
      let params = {TableName: this.table, Item: conv};
      this.client.put(params, function(err, data){
        if(err)
          observer.error(err);
        else
          observer.complete();
      });
    });
  }

}

module.exports = ConversationsDAODynamoDB;
