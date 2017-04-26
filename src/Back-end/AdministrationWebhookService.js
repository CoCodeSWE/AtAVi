class AdministrationWebhookService
{
  /**
  * Costruttore del servizio di webhook per l'area di amministrazione
  * @param jwt {JsonWebTokenModule} - modulo di nodejs per la gestione di jsonwebtoken. Ne effettuiamo qui la dependency injection
  */
  constructor(jwt)
  {
    this.jwt = jwt;
  }

  /**
  * Lambda function che si occupa di rispondere alle richieste di api.ai, verificando la validità dei token presenti.
  * @param event {LambdaEvent} - event contenente i dati della richiesta, compreso il token
  * @param context {LambdaContext} - context necessario per mandare la risposta
  */
  webhook(event, context)
  {
    let body;
    try //controllo che il body della richiesta ricevuta sia effettivamente in json
    {
      body = JSON.decode(event.body);
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
      context.succeed({ statusCode: 200, body: JSON.strigify(error_body) });
    }
    if(body.originalRequest.data.token && this._checkToken(body.originalRequest.data.token))
    {
      let success_body = { speech: body.fulfillment.speech, data: body.originalRequest.data };
      context.succeed({ statusCode: 200, body: JSON.stringify(success_body) }); //token verificato, rispondo normalmente
    }
    else
    {
      let error_body =
      {
        speech: "Forbidden",
        data:
        {
          _status: 403
        }
      };
      context.succeed({ statusCode: 200, body:JSON.stringify(error_body) });  //token non verificato, accesso negato
    }
  }

  /**
  * Metodo utilizzato per controllare la validità di un token.
  * @param token {String} - jsonwebtoken da controllare
  * @return {boolean} - true nel caso in cui il token sia valido, false altrimenti
  */
  _checkToken(token)
  {
    try
    {
      this.jwt.verify(token, process.env.JWT_SECRET);
      return true;
    }
    catch (e) { return false; }
  }
}

module.exports = AdministrationWebhookService;
