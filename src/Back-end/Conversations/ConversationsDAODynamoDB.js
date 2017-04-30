const Rx = require('rxjs/Rx');

class ConversationsDAODynamoDB
{
  /**
		* Costruttore della classes
		* @param client {AWS::DynamoDB::DocumentClient} - Modulo di Node.js utilizzato per l'accesso al database DynamoDB contenente la tabella delle conversazioni
		*/
  constructor(client)
  {
    this.client = client;
    this.table = process.env.CONVERSATIONS_TABLE;
  }
  /**
		* Aggiunge una nuova conversazione in DynamoDB
		* @param conversation {Conversation} - Conversazione che si vuole aggiungere al sistema
		*/
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
  /**
    * Aggiunge un nuovo messaggio ad una conversazione in DynamoDB
    * @param msg {ConversationMsg} - messaggio che si vuole aggiungere alla conversazione
    * @param session_id {String} - id della sessione della conversazione dove aggiungere il messaggio
    */
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
          "#messages": 'messages'
        },
        UpdateExpression: "set #messages= list_append(#messages, :msg)"
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
  };

  /**
		* Ottiene la conversazione avente l'id della sessione passato come parametro
		* @param session_id {String} - id della sessione della conversazione che si vuole ottenere
		*/
  getConversation(session_id)
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
      self.client.get(params, function(err, data)
      {
        if(err)
          observer.error(err);
        else
          observer.next(data);
          observer.complete();
      });
    });
  }
  /**
		* Ottiene la lista delle conversazioni aventi l'd del Guest come parametro, suddivisi in blocchi (da massimo da 1MB)
		* @param guest_id {String} - id del Guest della lista di conversazioni che si vuole ottenere
		*/
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
      self.client.scan(params, self._onScan(observer, params));
    });
  }

  /**
    * Elimina la conversazione avente l'id della sessione  passato come parametro
    * @param session_id {String} - Parametro contenente l'id dello sessione della conversazione che si vuole rimuovere
    */

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


/**
  * Viene ritornata la funzione di callback per la gesitone dei blocchi di getConversationList
  * @param observer {ConversationObserver} - Observer da notificare
  * @param params {Object} - Parametro passato alla funzione scan del DocumentClient
  */
  _onScan(observer, params)
  {
    let self = this;
  	return function(err, data)
  	{
  		if(err)
  			observer.error(err);
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

module.exports = ConversationsDAODynamoDB;
