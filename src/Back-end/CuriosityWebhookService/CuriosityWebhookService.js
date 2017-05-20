/**
* Questa classe si occupa di implementare l'interfaccia \file{WebhookService}, implementando un Webhook che fornisce una risposta ad api.ai.
* @author Mattia Bottaro
* @version 0.0.4
* @since 0.0.3-alpha
*/
class CuriosityWebhookService
{
  /**
   * Costruttore del Webhook relativo all'assistente di conversazione
   * @param {CuriosityDAO} curiositiess - DAO utilizzato per l'accesso ai dati relativi alle curiosità
   */
  constructor(curiosities)
  {
    this.curiosities = curiosities;
  }

  /**
  * Lambda function che si occupa di rispondere alle richieste di api.ai, verificando la validità dei token presenti.
  * @param {LambdaEvent} event - event contenente i dati della richiesta.
  * @param {LambdaContext} context - context necessario per mandare la risposta
  */

  webhook(event, context)
  {
    let body;
    try //controllo che il body della richiesta ricevuta sia effettivamente in json
    {
      body = JSON.parse(event.body);
    }
    catch(err)  //nel caso in cui il corpo non sia JSON valido viene sollevata un'eccezione
    {
      console.log(err);
      context.succeed({speech: 'Errore', data: {_status: 400}});
    }
    //costanti errori
    this.error400 =
    {
      statusCode: 200,
      body: JSON.stringify(
      {
        speech: "Bad Request",
        data: Object.assign({ _status: 400}, (body.originalRequest ? body.originalRequest.data : {})),
      })
    };
    this.error500 =
    {
      statusCode: 200,
      body: JSON.stringify(
      {
        speech: "Internal Server Error",
        data: Object.assign({ _status: 500}, (body.originalRequest ? body.originalRequest.data : {})),

      })
    };
  }




}
