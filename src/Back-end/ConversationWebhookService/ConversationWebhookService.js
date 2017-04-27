//forse non serve jwt, magari lo fa api gateway
//forse i test sono da aggiornare, non so se sono stati definiti correttamente

class ConversationWebhookService
{ 
  /**
   * Costruttore del Webhook relativo all'assistente di conversazione
   */
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
    catch(err)  //nel caso in cui il corpo non sia JSON valido viene sollevata un'eccezione
    {
      console.log(err);
      context.succeed(error400);
    }
    switch(body.result.action)
    {
      case 'user.check':  //controllo se si tratta di amministratore
      {
        this._checkUser(body, context);
        break;
      }
      case 'guest.check': //controllo se si tratta di un ospite già veenuto in passato
      {
        this.checkGuest();
        break;
      }
      default:  //copio la risposta dell'assistente virtuale e la restituisco così come mi è arrivata
      {
        this._defaultResponse();
      }
    }
  }
  
  _checkUser(body, context)
  {
    let self = this;
    let observable = this.users.getUserList({name: body.result.contexts[0].parameters.name});
    let users = [];
    observable.subscribe(
    {
      next: (user) => {users.push(user);},
      error: (err) => {context.succeed(error500);},
      complete: () => 
      {
        if(users.length > 0)
        {
          context.succeed(
          {
            statusCode: 200,
            body: JSON.stringify(
            {
              //forse i dati che metto nel context posso metterli direttamente in data di event, senza creare il context
              //cosi eviterei anche di avere più di un context attivo nello stesso momento
              //forse però ho bisogno di settare il context per attivare la richista di conferma
              contextOut: [
              {
                name: admin,
                lifespan: 0,  //dura solo un'interazione e poi sparisce
                parameters:
                {
                  username: users[0].username; //metto come possibile username il primo. Nel caso l'utente dirà di cambiare username
                }
              }],
              data: body.originalRequest.data,
              followupEvent: 
              {
                name: "eventoAdminRiconosciuto",
                data: 
                {
                  //metto username qua?
                }
              }
            })
          });
        }
        else
          self._checkGuest(body, context);
      }
    });
  }
  
  _checkGuest()
  {
    let self = this;
    let observable = this.guests.getGuestList({name: body.result.contexts[0].parameters.name});
    let guests = [];
    observable.subscribe(
    {
      next: (guest) => {guests.push(guest);},
      error: (err) => {context.succeed(error500);},
      complete: () => 
      {
        if(users.length > 0)
        {
          context.succeed(
          {
            statusCode: 200,
            body: JSON.stringify(
            {
              //come sopra
              contextOut: [
              {
                name: guest,  //dovrebbe avere lo stesso nome del context da cui ho preso il nome, non sono credo che utilizzando un nome diverso venga passato anche a quel context
                lifespan: 0,  //dura solo 1 interazione e poi sparisce
                parameters:
                {
                  company: guests[0].company; //metto come possibile azienda la prima. Nel caso l'utente potrà dire che appartiene ad un'altra azienda
                }
              }],
              data: body.originalRequest.data,
              followupEvent: 
              {
                name: "eventoOspiteRiconosciuto",
                data: 
                {
                  //metto azienda qua?
                }
              }
            })
          });
        }
        else
          self._defaultResponse(body, context);
      }
    });
  }
  
  _defaultResponse(body, context)
  {
    context.succeed(
    {
      statusCode: 200,
      body: JSON.stringify(
      {
        speech: body.result.fulfillment.speech,
        displayText: body.result.fulfillment.displayText,
        data: body.originalRequest.data
      })
    });
  }
}

module.exports = ConversationWebhookService;


/**********************
 * COSTANTI ERRORI
 *********************/
const error400 =
{
  statusCode: 200,
  body: JSON.stringify(
  {
    speech: "Bad Request",
    data:
    {
      _status: 400
    }
  })
};

const error400 =
{
  statusCode: 200,
  body: JSON.stringify(
  {
    speech: "Internal Server Error",
    data:
    {
      _status: 500
    }
  })
};

/*
 * HEADERS CORS, non so se servano effettivamente, nel caso si possono abilitare ed aggiungere alle varie chiamate
 * a context.succeed
 * 
let headers = 
{
  "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
  "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS 
}*/