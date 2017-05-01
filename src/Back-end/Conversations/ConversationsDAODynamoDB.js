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
            observer.next(data.Item);
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
          observer.next(data.Item);
          observer.complete();
      });
    });
  }
  /**
		* Ottiene la lista delle conversazioni aventi l'd del Guest come parametro, suddivisi in blocchi (da massimo da 1MB)
		* @param query {Object} - Contiene i valori che verranno passati al FilterExpression dell'interrogazione
		*/
  getConversationList(query)
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
				if(Object.keys(filter_expression).length > 0)
				{
					params.FilterExpression = filter_expression.FilterExpression;
					params.ExpressionAttributeValues = filter_expression.ExpressionAttributeValues;
				}
			}
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
  			data.Items.forEach((conv) => { observer.next(conv.Item);});
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
/**
	* Ritorna un oggetto contenente FilterExpression (stringa) e ExpressionAttributeValues (object)
	* @param obj {Object} - Contiene i valori che verranno passati al FilterExpression dell'interrogazione
	*/
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

// probabilmente da modificare
const attr_map =
{
  name: 'full_name'
}

module.exports = ConversationsDAODynamoDB;
