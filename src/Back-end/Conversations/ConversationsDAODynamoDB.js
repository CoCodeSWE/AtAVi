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
    return new Rx.Observable(function(observer)
    {
      let params = {TableName: this.table, Item: conv};
      this.client.put(params, function(err, data)
      {
        if(err)
          observer.error(err);
        else
          observer.complete();
      });
    });
  }

  addMessage(msg, sessionId)
  {
    let self = this;
    return new Rx.Observable(function(observer)
    {
      let params = {
        TableName: this.table,
        Key: {"session_id": sessionId},
        UpdateExpression: "set #messages= list_append(#messages, :msg)",
        ReturnValues:"UPDATED_NEW" };
      };
      this.client.update(params, function(err, data)
      {
        if(err)
          observer.error(err);
        else
          observer.complete();
      });
    });
  }

  getConversation(sessionId)
  {
    let self = this;
    return new Rx.Observable(function(observer)
    {
      let params = {
        TableName: self.table,
        Key: {
          "session_id": sessionId
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
}

module.exports = ConversationsDAODynamoDB;
