const Rx = require('rxjs/Rx');
const mapProperties = require('map-object-properties');

class TasksDAODynamoDB
{
  /**
    * Costruttore della classes
    * @param client {AWS::DynamoDB::DocumentClient} - Modulo di Node.js utilizzato per l'accesso al database DynamoDB contenente la tabella dei tasks
    */
  constructor(client)
  {
    this.client = client;
    this.table = process.env.TASKS_TABLE;
  }

  /**
		* Aggiunge un nuovo task in DynamoDB
		* @param task {Task} - Task che si vuole aggiungere al sistema
		*/
  addTask(task)
  {
    let self = this;
    return new Rx.Observable(function(observer)
		{
      let params =
      {
        TableName: this.table,
        Item: task,
				ConditionExpression: 'attribute_not_exists(type)'
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
		* Ottiene il task avente il type passato come parametro
		* @param type {String} - Parametro contenente il type del task che si vuole ottenere.
		*/
  getTask(type)
  {
    let self = this;
    return new Rx.Observable(function(observer)
    {
      let params =
      {
        TableName: self.table,
        Key:
        {
          type: type // un task è identificato dal nome del suo tipo
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
    * Ottiene la lista dei task in DynamoDB, suddivisi in blocchi (da massimo da 1MB)
    * @param query {Object} - Contiene i valori che verranno passati al FilterExpression dell'interrogazione
    */
  getTaskList(query)
  {
    let self = this;
    return new Rx.Observable(function(observer)
    {
      let params =
      {
        TableName: self.table
      };

      // Controllo se i task da restituire hanno dei filtri (contenuti in query)
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
		* Elimina il task avente il type passato come parametro
		* @param type {String} - Parametro contenente il type del Task che si vuole rimuovere
		*/
  removeTask(type)
  {
    let self = this;
    return new Rx.Observable(function(observer)
    {
      let params =
      {
        TableName: self.table,
        Key:
        {
          type: type
        },
				ConditionExpression: 'attribute_exists(type)'
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
		* Aggiorna il task passato come parametro (se non c'è lo crea)
		* @param task {Task} - Parametro contenente i dati relativi al Task che si vuole modificare
		*/
  updateTask(task)
  {
    let self = this;
    return new Rx.Observable(function(observer)
    {
      let params =
      {
        TableName: self.table,
        Item: mapProperties(task, attr_map)
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
    * Viene ritornata la funzione di callback per la gesitone dei blocchi di getTaskList
    * @param observer {TaskObserver} - Observer da notificare
    * @param params {Object} - Parametro passato alla funzione scan del DocumentClient
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
  			data.Items.forEach((task) => observer.next(mapProperties(task, reverse_attr_map)));
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

module.exports = TasksDAODynamoDB;
