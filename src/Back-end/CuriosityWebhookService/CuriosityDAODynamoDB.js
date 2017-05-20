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
    this.table = process.env.CURIOSITY_TABLE;
  }


  /**
    * Ottiene una curiosità casuale della categoria scelta
    * @param {String} type - Parametro contenente la categoria scelta
    * @param {String} id - Parametro contenente l'id della curiosità
    */
   getCuriosity(type,id)
   {
     let self = this;
     return new Rx.Observable(function(observer)
     {
       let params =
       {
         TableName: self.table,
         ExpressionAttributeValues :
         {
           ":type": type,
           ":id": id
         },
         KeyConditionExpression : "id >= :id",
         FilterExpression : "category = :type",
         Limit : 1
       };
       self.client.get(params, function(err, data)
       {
         if(err)
           observer.error(err);
         else if(!data.Item)
   				observer.error({ code: 'Not found' });
         else
         {
           observer.next(data.Item);
           observer.complete();
         }
       });
     });
   }
}
