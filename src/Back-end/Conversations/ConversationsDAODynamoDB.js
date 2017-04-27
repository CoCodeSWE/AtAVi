const Rx = require('rxjs/Rx');

class ConversationsDAODynamoDB
{
  constructor(client)
  {
    this.client = client;
    this.table = 'Conversations';
  }
  // aggiunge una conversazione a DynamoDB
  addConversation(conversation)
  {
    let self = this;
    return new Rx.Observable(function(observer)
    {
      let params =
      {
        TableName: self.table,
        Item: conversation
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
  //aggiunge un messaggio ad una conversazione su DynamoDB
  addMessage(msg, session_id)
  {
    let self = this;
    return new Rx.Observable(function(observer)
    {
      let params = {
        TableName: self.table,
        Key: {"session_id": session_id},
        ExpressionAttributeValues:
        {
          ":msg": msg
        },
        ExpressionAttributeNames:
        {
          "#messages":messages
        },
        UpdateExpression: "set #messages= list_append(#messages, :msg)"
      };
    });
    self.client.update(params, function(err, data)
    {
      if(err)
        observer.error(err);
      else
        observer.complete();
    });
  };

  //ottiene una conversazione da DynamoDB
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
      self.client.get(params, function(err, data)
      {
        if(err)
          observer.error(err);
        else
          observer.complete();
      });
    });
  }
  //ottiene la lista delle conversazioni su DynamoDB
  getConversationList(guest_id)
  {
    let self = this;
    return new Rx.Observable(function(observer)
    {
      let params = {
        TableName: self.table,
        ExpressionAttributeValues:
        {
          ":id_guest":guest_id
        },
        FilterExpression: "guest_id = :id_guest"
      };
      self.client.scan(params, onScan(observer, self));
    });
  }

  //rimouve una conversazione da DynamoDB
  removeConversation(session_id)
  {
    let self = this;
    return new Rx.Observable(function(observer)
    {
      let params = {
        TableName: self.table,
        Key: {
          "session_id": session_id
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
}

// Viene ritornata la funzione di callback per la gesitone dei blocchi di getConversationList
function onScan(observer, conversations)
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
					TableName: conversations.table,
					ExclusiveStartKey: data.LastEvaluatedKey
				};
				conversations.client.scan(params, onScan(observer, conversations));
			}
			else
			{
				observer.complete();
			}
		}
	}
}

module.exports = ConversationsDAODynamoDB;
