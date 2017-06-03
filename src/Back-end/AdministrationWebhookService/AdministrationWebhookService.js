/**
* Questa classe si occupa di implementare l'interfaccia WebhookService, realizzando un Webhook che fornisce una risposta all'Agent di amministrazione.
* @author Simeone Pizzi
* @version 0.0.4
* @since 0.0.3-alpha
*/
const VET_TOKEN = process.env.VER_TOKEN;

class AdministrationWebhookService
{
  /**
   * Costruttore del servizio di webhook per l'area di amministrazione
   * @param {JsonWebTokenModule} jwt - modulo di nodejs per la gestione di jsonwebtoken. Ne effettuiamo qui la dependency injection
   */
  constructor(jwt)
  {
    this.jwt = jwt;
  }

  /**
  * Lambda function che si occupa di rispondere alle richieste di api.ai, verificando la validità dei token presenti.
  * @param {LambdaEvent} event - event contenente i dati della richiesta, compreso il token
  * @param {LambdaContext} context - context necessario per mandare la risposta
  */
  webhook(event, context)
  {
    let body;
    try //controllo che il body della richiesta ricevuta sia effettivamente in json
    {
      body = JSON.parse(event.body);
    }
    catch(err)
    {
      let error_body =
      {
        speech: "Bad Request",
        data:
        {
          _status: 400
        }
      };
      console.log(err);
      context.succeed({ statusCode: 200, body: JSON.stringify(error_body) });
    }
    if(body.originalRequest.data && this._checkToken(body.originalRequest.data.token))
    {
      let success_body = { speech: body.result.fulfillment.speech, data: Object.assign({_status: 200}, (body.originalRequest ? body.originalRequest.data : {})) };
      context.succeed({ statusCode: 200, body: JSON.stringify(success_body) }); //token verificato, rispondo normalmente
    }
    else
    {
      let error_body =
      {
        speech: "Forbidden",
        data: Object.assign({ _status: 403}, (body.originalRequest ? body.originalRequest.data : {})),
      };
      context.succeed({ statusCode: 200, body:JSON.stringify(error_body) });  //token non verificato, accesso negato
    }
  }

  /**
  * Metodo utilizzato per controllare la validità di un token.
  * @param {String} token - jsonwebtoken da controllare
  * @return {boolean} - true nel caso in cui il token sia valido, false altrimenti
  */
  _checkToken(token)
  {
    if(token === VER_TOKEN) //client slack
      return true;
    try
    {
      this.jwt.verify(token, process.env.JWT_SECRET);
      return true;
    }
    catch (e) { return false; }
  }
}

module.exports = AdministrationWebhookService;
