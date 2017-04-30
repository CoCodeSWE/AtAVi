const Rx = require('rxjs/Rx');

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
    return new Rx.Observable(function(observer){
      let params =
      {
        TableName: this.table,
        Item: task
      };
      self.client.put(params, function(err, data){
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
          HashKey: type // un task è identificato dal nome del suo tipo
        }
      };
      self.client.get(params, function(err, data)
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
          HashKey: type
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
        Key:
        {
          HashKey: task.type
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
  			observer.error(err);
  		else
  		{
  			observer.next(data);
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

module.exports = TasksDAODynamoDB;
