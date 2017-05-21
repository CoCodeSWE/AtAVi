/**
* Classe che si occupa di implementare l'interfaccia \file{GuestsDAO}, utilizzando un database DynamoDB come supporto per la memorizzazione dei dati.
* @author Luca Bertolini
* @version 0.0.6
* @since 0.0.3-alpha
*/
const Rx = require('rxjs/Rx');
const mapProperties = require('map-object-properties');

class GuestsDAODynamoDB
{
  /**
	* Costruttore della classes
	* @param {AWS.DynamoDB.DocumentClient} client - Modulo di Node.js utilizzato per l'accesso al database DynamoDB contenente la tabella dei Guests
	*/
  constructor(client)
  {
    this.client = client;
    this.table = process.env.GUESTS_TABLE;
  }

  /**
	* Aggiunge un nuovo Guest in DynamoDB
	* @param {Guest} guest - Guest che si vuole aggiungere al sistema
	*/
  addGuest(guest)
  {
    let self = this;
    return new Rx.Observable(function(observer)
    {
      let params =
      {
        TableName: self.table,
        Item:  mapProperties(guest, attr_map),
				ConditionExpression: 'attribute_not_exists(guest_name) && attribute_not_exists(company)'
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
	* Ottiene il guest avente name e company passato come parametro
	* @param {String} name -  nome del Guest
	* @param {String} company - azienda di provenienza del Guest
	*/
  getGuest(name,company)
  {
    console.log("GUEST: "+name+ " "+company);
    let self = this;
    return new Rx.Observable(function(observer)
    {
      let params =
			{
        TableName: self.table,
        Key:
				{
          "guest_name": name,
          "company": company
        }
      };
      console.log(params);
      self.client.get(params, function(err, data)
      {
        if(err)
          observer.error(err);
				else if(!data.Item)
					observer.error({ code: 'Not found' });
        else
				{
          observer.next(mapProperties(data.Item, reverse_attr_map));
          observer.complete();
				}
      });
    });
  }

  /**
	* Elimina il Guest avente name e company passati come parametro
	* @param {String} name -  nome del Guest
	* @param {String} company - azienda di provenienza del Guest
	*/
  removeGuest(name,company)
  {
    let self = this;
    return new Rx.Observable(function(observer)
    {
      let params =
			{
        TableName: self.table,
        Key:
				{
          "guest_name": name,
          "company": company
        },
				ConditionExpression: 'attribute_exists(guest_name) && attribute_exists(company)'
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
	* Ottiene la lista dei Guest in DynamoDB, suddivisi in blocchi (da massimo da 1MB)
	* @param {Object} query - Contiene i valori che verranno passati al FilterExpression dell'interrogazione
	*/
  getGuestList(query)
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
	* Aggiorna il Guest passato come parametro (se non c'è lo crea)
	* @param {Guest} guest - Parametro contenente i dati relativi al Guest che si vuole modificare
	*/
  updateGuest(guest)
  {
    let self = this;
    return new Rx.Observable(function(observer)
    {
      let params =
      {
        TableName: self.table,
        Item: mapProperties(guest, attr_map)
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
  * Aggiunge l'id di una conversazione alla lista conversations del guest identificato da name e company
  * @param {String} name - Nome del guest
  * @param {String} company - Azienda del guest
	* @param {Number} session_id - Id della conversazione
  */
	addConversation(name, company, session_id)
	{
		let self = this;
		return new Rx.Observable(function(observer)
		{
			let params =
			{
				TableName: self.table,
				Key:
				{
					'guest_name': name,
					'company': company
				},
				UpdateExpression: 'set conversations = list_append(conversations, :conversation)',
				ConditionExpression: 'not(contains(attori, :check_conversation))',
				ExpressionAttributeValues:
				{
					':conversation': [session_id],
					'check_conversation': session_id
				}
			};
			self.client.update(params, function(err, data)
			{
				if(err)
					observer.error(err);
				else
					observer.complete();
			});
		});
	}

	/**
  * Viene ritornata la funzione di callback per la gesitone dei blocchi di getGuestList e query
  * @param {GuestObserver} observer - Observer da notificare
  * @param {Object} params - Parametro passato alla funzione scan del DocumentClient
  */
  _onScan(observer, params)
  {
      let self = this;
    	return function(err, data)
    	{
    		if(err)
				{
    			 observer.error(err);
    		}
				else
    		{
    		  data.Items.forEach((guest) => observer.next(mapProperties(guest, reverse_attr_map)));
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
  name: 'guest_name'
}

const reverse_attr_map =
{
  guest_name: 'name'
}

module.exports = GuestsDAODynamoDB;
