const Rx = require('rxjs/Rx');

class guestsDAODynamoDB
{
  /**
		* Costruttore della classes
		* @param client {AWS::DynamoDB::DocumentClient} - Modulo di Node.js utilizzato per l'accesso al database DynamoDB contenente la tabella dei Guests
		*/
  constructor(client)
  {
    this.client = client;
    this.table = process.env.GUESTS_TABLE;
  }
  /**
		* Aggiunge un nuovo Guest in DynamoDB
		* @param guest {Guest} - Guest che si vuole aggiungere al sistema
		*/
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
  /**
		* Ottiene il guest avente name e company passato come parametro
		* @param name {String} -  nome del Guest
    * @param company {String} - azienda di provenienza del Guest
		*/
  getGuest(name,company)
  {
    let self = this;
    return new Rx.Observable(function(observer)
    {
      let params = {
        TableName: self.table,
        Key: {
          "name": name,
          "company": company
        }
      };
      self.client.get(params, function(err, data)
      {
        if(err)
          observer.error(err);
        else
          observer.next(mapProperties(data.Item, reverse_attr_map));
          observer.complete();
      });
    });
  }
  /**
    * Elimina il Guest avente name e company passati come parametro
    * @param name {String} -  nome del Guest
    * @param company {String} - azienda di provenienza del Guest
    */
  removeGuest(name,company)
  {
    let self = this;
    return new Rx.Observable(function(observer)
    {
      let params = {
        TableName: self.table,
        Key: {
          "name": name,
          "company": company
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
		* Ottiene la lista dei Guest in DynamoDB, suddivisi in blocchi (da massimo da 1MB)
    * @param query {Object} - Contiene i valori che verranno passati al FilterExpression dell'interrogazione
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
		* @param guest {Guest} - Parametro contenente i dati relativi al Guest che si vuole modificare
		*/
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
          observer.next(data.Item);
          observer.complete();
        }
      });
    });
  }


/**
  * Viene ritornata la funzione di callback per la gesitone dei blocchi di getGuestList e query
  * @param observer {GuestObserver} - Observer da notificare
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
    		  data.Items.forEach((guest) => observer.next(mapProperties(guest.Item, reverse_attr_map)));
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

  let new_obj = mapProperties(obj, attr_map);

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

function mapProperties(object, map)
{
  let new_obj = {};
  for(let i in object)
  {
    let key = map[i] ? map[i] : i;  // calcolo il valore della nuova key che, nel caso in cui non esista una mappatura, sarà uguale alla vecchia
    new_obj[key] = object[i];  // assegno il valore che aveva obj[i] con la vecchia key a new_obj[key] con la nuova key.
  }
  return new_obj;
}

const attr_map =
{
  name: 'full_name'
}
const reverse_attr_map =
{
  full_name: 'name'
}
module.exports = guestsDAODynamoDB;
