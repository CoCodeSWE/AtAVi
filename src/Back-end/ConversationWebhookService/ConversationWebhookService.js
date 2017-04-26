class ConversationWebhookService
{
  constructor(conversations, guests, users, jwt)
  {
    this.users = users;
    this.guests = guests;
    this.users = users;
    this.jwt = jwt;
  }

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
    switch(body.result.action)
    {
      case 'user.login':  //login dell'utente, viene solo tramite evento
      {
        break;
      }
      case 'user.check':  //controllo se si tratta di amministratore
      {

      }
      case 'guest.check': //controllo se si tratta di un ospite già veenuto in passato
      {

      }
      default:
      {

      }
    }
  }
}

module.exports = ConversationWebhookService;
