/**
* Classe che si occupa di implementare l'interfaccia \file{RulesDAO}, utilizzando un database DynamoDB come supporto per la memorizzazione dei dati.
* @author Mattia Bottaro
* @version 0.0.4
* @since 0.0.3-alpha
*/
const Rx = require('rxjs/Rx');
const mapProperties = require('map-object-properties');

class RulesDAODynamoDB
{
  /**
    * Costruttore della classes
    * @param {AWS.DynamoDB.DocumentClient} client - Modulo di Node.js utilizzato per l'accesso al database DynamoDB contenente la tabella delle rules
    */
  constructor(client)
  {
    this.client = client;
    this.table = process.env.RULES_TABLE;
  }

  /**
		* Aggiunge una nuova rule in DynamoDB
		* @param {Rule} rule - Rule che si vuole aggiungere al sistema
		*/
  addRule(rule)
  {
    let self = this;
    return new Rx.Observable(function(observer)
		{
      let params =
      {
        'TableName': self.table,
        'Item': mapProperties(rule, attr_map),
				'ConditionExpression': 'attribute_not_exists(rule_name)'
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
		* @param {String} id - Parametro contenente l'id della Rule che si vuole ottenere.
		*/
  getRule(name)
  {
    let self = this;
    return new Rx.Observable(function(observer)
    {
      let params =
      {
        TableName: self.table,
        Key:
        {
          'rule_name': name
        }
      };
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
    * Ottiene la lista delle rule in DynamoDB, suddivisi in blocchi (da massimo da 1MB)
    * @param {Object} query - Contiene i valori che verranno passati al FilterExpression dell'interrogazione
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
			console.log(params);
			self.client.scan(params, self._onScan(observer, params));
		});
  }

  /**
		* Elimina la rule avente l'id passato come parametro
		* @param {String} id - Parametro contenente l'id della Rule che si vuole rimuovere
		*/
  removeRule(name)
  {
    let self = this;
    return new Rx.Observable(function(observer)
    {
      let params =
      {
        TableName: self.table,
        Key:
        {
          'rule_name': name
        },
        ConditionExpression: 'attribute_exists(rule_name)'
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
		* @param {Rule} rule - Parametro contenente i dati relativi alla Rule che si vuole modificare
		*/
  updateRule(rule)
  {
    let self = this;
    return new Rx.Observable(function(observer)
    {
      let params =
      {
        TableName: self.table,
        Item: mapProperties(rule, attr_map)
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
    * Viene ritornata la funzione di callback per la gesitone dei blocchi di getRuleList
    * @param {RuleObserver} observer - Observer da notificare
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
        data.Items.forEach((rule) => observer.next(mapProperties(rule, reverse_attr_map)));
  			if(data.LastEvaluatedKey)
  			{
  				params.ExclusiveStartKey= data.LastEvaluatedKey;
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
    filter_expression.ExpressionAttributeValues[`:${key}`] = Boolean(new_obj[key] === 'true');
    //filter_expression.ExpressionAttributeValues[`:${key}`] = new_obj[key];

  }
	// Tolgo l'and finale dal FilterExpression
	filter_expression.FilterExpression = filter_expression.FilterExpression.slice(0,-5);
  return filter_expression;
}

const attr_map =
{
  name: 'rule_name',
  override: 'overr'
}

const reverse_attr_map =
{
  rule_name: 'name',
  overr: 'override'
}

module.exports = RulesDAODynamoDB;
