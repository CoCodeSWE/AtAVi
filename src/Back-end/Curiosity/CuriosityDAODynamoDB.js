/**
* Classe che si occupa di implementare l'interfaccia \file{CuriosityDAO}, utilizzando un database DynamoDB come supporto per la memorizzazione dei dati.
* @author Andrea Magnan
* @version 0.0.4
* @since 0.0.3-alpha
*/

const Rx = require('rxjs/Rx');

class CuriosityDAODynamoDB
{
  /**
    * Costruttore della classe
    * @param {AWS.DynamoDB.DocumentClient} client - Modulo di Node.js utilizzato per l'accesso al database DynamoDB contenente la tabella delle curiosities
    */
  constructor(client)
  {
    this.client = client;
    this.table = process.env.CURIOSITIES_TABLE;
  }


  /**
    * Ottiene una curiosità casuale della categoria scelta
    * @param {String} type - Parametro contenente la categoria scelta
    */
   getCuriosity(type)
   {
     let self = this;
     return new Rx.Observable(function(observer)
     {
       let params =
       {
         TableName: self.table,
         ExpressionAttributeValues =
         {
           {":type", type}
         }
         FilterExpression = "type = :type";
       };
       self.client.scan(params, self._onScan(observer, params));
     });
   }

   /**
     * Viene ritornata la funzione di callback per la gesitone dei blocchi di getCuriosity
     * @param {CuriosityObserver} observer - Observer da notificare
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
        data.Items.forEach((curiosity) => observer.next(curiosity));
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
