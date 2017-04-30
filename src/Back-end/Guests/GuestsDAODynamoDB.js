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
          observer.next(data);
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
    * Ottiene la lista dei Guest avente name come parametro, suddivisi in blocchi (da massimo da 1MB)
    * @param name {String} -  nome del Guest
    */
  query(name)
  {
    let self = this;
    return new Rx.Observable(function(observer)
    {
      let params = {
        TableName: self.table,
        ExpressionAttributeValues:
        {
          ":name_guest":name
        },
        FilterExpression: "name = :name_guest"
      };
      self.client.scan(params, _onScan(observer, params));
    });
  }

  /**
		* Ottiene la lista dei Guest in DynamoDB, suddivisi in blocchi (da massimo da 1MB)
		*/
  getGuestList()
  {
    let self = this;
    return new Rx.Observable(function(observer)
    {
      let params = {TableName: self.table};
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
          observer.next(data);
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
module.exports = guestsDAODynamoDB;
