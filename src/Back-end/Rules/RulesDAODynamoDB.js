const Rx = require('rxjs/Rx');

class RulesDAODynamoDB
{
  /**
    * Costruttore della classes
    * @param client {AWS::DynamoDB::DocumentClient} - Modulo di Node.js utilizzato per l'accesso al database DynamoDB contenente la tabella delle rules
    */
  constructor(client)
  {
    this.client = client;
    this.table = process.env.RULES_TABLE;
  }

  /**
		* Aggiunge una nuova rule in DynamoDB
		* @param rule {Rule} - Rule che si vuole aggiungere al sistema
		*/
  addRule(rule)
  {
    let self = this;
    return new Rx.Observable(function(observer){
      let params =
      {
        'TableName': this.table,
        'Item': rule
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
		* Ottiene la rule avente l'id passato come parametro
		* @param id {String} - Parametro contenente l'id della Rule che si vuole ottenere.
		*/
  getRule(id)
  {
    let self = this;
    return new Rx.Observable(function(observer)
    {
      let params =
      {
        TableName: self.table,
        Key:
        {
          'HashKey': id
        }
      };
      self.client.get(params, function(err, data)
      {
        if(err)
          observer.error(err);
        else if(!data.id)
  				observer.error('Not found');
        else
        {
          observer.next();
          observer.complete();
        }
      });
    });
  }

  /**
    * Ottiene la lista delle rule in DynamoDB, suddivisi in blocchi (da massimo da 1MB)
    * @param query {Object} - Contiene i valori che verranno passati al FilterExpression dell'interrogazione
    */
  getRuleList(query)
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
		* Elimina la rule avente l'id passato come parametro
		* @param id {String} - Parametro contenente l'id della Rule che si vuole rimuovere
		*/
  removeRule(id)
  {
    let self = this;
    return new Rx.Observable(function(observer)
    {
      let params =
      {
        TableName: self.table,
        Key:
        {
          'HashKey': id
        },
        ConditionExpression: 'attribute_exists(HashKey)'
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
		* Aggiorna la Rule passata come parametro (se non c'è lo crea)
		* @param rule {Rule} - Parametro contenente i dati relativi alla Rule che si vuole modificare
		*/
  updateRule(rule)
  {
    let self = this;
    return new Rx.Observable(function(observer)
    {
      let params =
      {
        TableName: self.table,
        Key:
        {
          'HashKey': rule.id
        }
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
    * Viene ritornata la funzione di callback per la gesitone dei blocchi di getRuleList
    * @param observer {RuleObserver} - Observer da notificare
    * @param params {Object} - Parametro passato alla funzione scan del DocumentClient
    */
  _onScan(observer, rules)
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
  					TableName: rules.table,
  					ExclusiveStartKey: data.LastEvaluatedKey
  				};
  				rules.client.scan(params, onScan(observer, rules));
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

module.exports = RulesDAODynamoDB;
