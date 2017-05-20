/**
* Questa classe si occupa di implementare l'interfaccia \file{WebhookService}, implementando un Webhook che fornisce una risposta ad api.ai restituendo una curiosità di un certo tipo.
* @author Mattia Bottaro
* @version 0.0.4
* @since 0.0.3-alpha
*/
class CuriosityWebhookService
{
  /**
   * Costruttore del Webhook relativo all'assistente di conversazione
   * @param {CuriosityDAO} curiosities - DAO utilizzato per l'accesso ai dati relativi alle curiosità
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
      context.succeed({speech: 'Error', data: {_status: 400}});
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
    switch(body.result.action)
    {
      case 'curiosity.sporcdct':
      {
        /*
        let observable = this.curiosities.getCuriosity('sport');
        let curiosity_from_db = {text: "provo1", type:"sporto"};
        observable.subscribe(
          {
            next: (curiosity) => {curiosity_from_db = curiosity;},
            error: (err) => {context.succeed(this.error500);},
            complete: () =>
            {
              context.succeed(
                {
                  statusCode: 200,
                  body: JSON.stringify(
                    {
                      speech: body.result.fulfillment.speech,
                      displayText: body.result.fulfillment.displayText,
                      data: Object.assign({ _status: 200 }, (body.originalRequest ? body.originalRequest.data : {})),
                      followupEvent: {name: "sportCuriosityEvent", data: {"text": curiosity_from_db.text, "type": curiosity_from_db.type}}
                    })
                });
            }
          });
          */
        break;
      }
      case 'curiosity.technology':
      {
        let observable = this.curiosities.getCuriosity('technology');
        break;
      }
      case 'curiosity.food':
      {
        break;
      }
      case 'curiosity.general':
      {
        break;
      }
      case 'curiosity.firstGeneral':
      {
        break;
      }
      default:
      {
        context.succeed(
          {
            statusCode: 200,
            body: JSON.stringify(
              {
                speech: body.result.fulfillment.speech,
                displayText: body.result.fulfillment.displayText,
                data: Object.assign({ _status: 200 }, (body.originalRequest ? body.originalRequest.data : {})),
                followupEvent: {name: "sportCuriosityEvent", data: {"text": curiosity_from_db.text, "type": curiosity_from_db.type}}
              })
          });
      }
    }
  }
}

module.exports = CuriosityWebhookService;
