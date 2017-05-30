/**
* Classe che si occupa di implementare l'interfaccia \file{ConversationsDAO}, utilizzando un database DynamoDB come supporto per la memorizzazione dei dati.
* @author Mauro Carlin
* @version 0.0.5
* @since 0.0.3-alpha
*/
const Rx = require('rxjs/Rx');
const mapProperties = require('map-object-properties');

class ConversationsDAODynamoDB
{
  /**
	* Costruttore della classes
	* @param {AWS.DynamoDB.DocumentClient} client - Modulo di Node.js utilizzato per l'accesso al database DynamoDB contenente la tabella delle conversazioni
	*/
  constructor(client)
  {
    this.client = client;
    this.table = process.env.CONVERSATIONS_TABLE;
  }

  /**
	* Aggiunge una nuova conversazione in DynamoDB
	* @param {Conversation} conversation - Conversazione che si vuole aggiungere al sistema
	*/
  addConversation(conversation)
  {
    let self = this;
    return new Rx.Observable(function(observer)
    {
      let params =
      {
        TableName: self.table,
        Item: mapProperties(conversation, attr_map),
				ConditionExpression: 'attribute_not_exists(session_id)'
      };
      self.client.put(params, function(err, data)
      {
        if(err){
			console.log("add conv", err);
          observer.error(err);
	    }
        else
          observer.complete();
      });
    });
  }

  /**
	* Aggiunge un array di nuovi messaggi ad una conversazione in DynamoDB
	* @param {ConversationMsgArray} msgs - messaggi che si vogliono aggiungere alla conversazione
	* @param {String} session_id - id della sessione della conversazione dove aggiungere il messaggio
	*/
  addMessages(msgs, session_id)
  {
	console.log("addMessages called", msgs);
    let self = this;
    return new Rx.Observable(function(observer)
    {
      let params = {
        TableName: self.table,
        Key:
				{
					"session_id": session_id
				},
		UpdateExpression: "SET #messages = list_append(#messages, :msgs)",
		ExpressionAttributeNames:
        {
          "#messages": 'messages'
        },
        ExpressionAttributeValues:
        {
          ":msgs": msgs
        },
      };
      
      self.client.update(params, function(err, data)
      {
          if(err){
			observer.error(err);
		  }
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
	* @param {String} session_id - id della sessione della conversazione che si vuole ottenere
	*/
  getConversation(session_id)
  {
    let self = this;
    return new Rx.Observable(function(observer)
    {
      let params = {
        TableName: self.table,
        Key:
				{
          "session_id": session_id
        }
      };
      self.client.get(params, function(err, data)
      {
        if(err)
          observer.error(err);
        else
				{
          observer.next(mapProperties(data.Item, reverse_attr_map));
          observer.complete();
				}
			});
    });
  }

  /**
	* Ottiene la lista delle conversazioni aventi l'd del Guest come parametro, suddivisi in blocchi (da massimo da 1MB)
	* @param {Object} query - Contiene i valori che verranno passati al FilterExpression dell'interrogazione
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
	* @param {String} session_id - Parametro contenente l'id dello sessione della conversazione che si vuole rimuovere
	*/
  removeConversation(session_id)
  {
    let self = this;
    return new Rx.Observable(function(observer)
    {
      let params = {
        TableName: self.table,
        Key:
				{
          "session_id": session_id
        },
				ConditionExpression: 'attribute_exists(session_id)'
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
  * @param {ConversationObserver} observer - Observer da notificare
  * @param {Object} params - Parametro passato alla funzione scan del DocumentClient
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
  			data.Items.forEach((conv) => observer.next(mapProperties(conv, reverse_attr_map)));
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
* @param {Object} obj - Contiene i valori che verranno passati al FilterExpression dell'interrogazione
*/
function filterExpression(obj)
{
	let filter_expression =
	{
		FilterExpression: '',
		ExpressionAttributeValues: {}
	};

  let new_obj = mapProperties(obj, attr_map);

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

}

const reverse_attr_map =
{

}

module.exports = ConversationsDAODynamoDB;
