/**
* Questa classe si occupa di implementare l'interfaccia \file{WebhookService}, implementando un Webhook che fornisce una risposta ad api.ai.
* @author Andrea Magnan
* @version 0.0.4
* @since 0.0.3-alpha
*/
class ConversationWebhookService
{
  /**
   * Costruttore del Webhook relativo all'assistente di conversazione
   * @param {ConversationsDAO} conversations - DAO utilizzato per l'accesso ai dati relativi alle conversazioni degli ospiti con l'assistente virtuale
   * @param {GuestsDAO} guests - DAO utilizzato per l'accesso ai dati relativi agli ospiti che hanno già visitato l'azienda
   * @param {UsersDAO} users - DAO utilizzato per l'accesso ai dati relativi agli utenti (amministratori)
   */
  constructor(conversations, guests, users)
  {
    this.users = users;
    this.guests = guests;
    this.users = users;
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
    switch(body.result.action)
    {
      case 'user.check':  //controllo se si tratta di amministratore
      {
        this._checkUser(body, context);
        break;
      }
      case 'guest.check': //controllo se si tratta di un ospite già veenuto in passato
      {
        this._checkGuest(body, context);
        break;
      }
      default:  //copio la risposta dell'assistente virtuale e la restituisco così come mi è arrivata
      {
        this._defaultResponse(body, context);
      }
    }
  }

  /**
  * metodo privato utilizzato per controllare se la persona con cui stiamo parlando è un amministratore
  * @param {ApiAiRequestBody} body - contiene i dati della richiesta fatta da api.ai al webhook
  * @param {lambdaContext} context - permette di inviare una risposta ad api gateway
  */
  _checkUser(body, context)
  {
    console.log(body);
    let self = this;
    let observable = this.users.getUserList({name: body.result.parameters.name});
    let users = [];
    observable.subscribe(
    {
      next: (user) => {console.log("new user!", user); users.push(user);},
      error: (err) => {context.succeed(this.error500);},
      complete: () =>
      {
        console.log('len: ', users.length);
        if(users.length > 0)
        {
          context.succeed(
          {
            statusCode: 200,
            body: JSON.stringify(
            {
              data: Object.assign({ _status: 200 }, (body.originalRequest ? body.originalRequest.data : {})),
              followupEvent:
              {
                name: "recognizeAdminEvent",
                data:
                {
                  name: users[0].name,
                  username: users[0].username
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

  /**
  * metodo privato utilizzato per controllare se la persona con cui stiamo parlando è un ospite che ha già visitato l'azienda in precedenza
  * @param {ApiAiRequestBody} body - contiene i dati della richiesta fatta da api.ai al webhook
  * @param {lambdaContext} context - permette di inviare una risposta ad api gateway
  */
  _checkGuest(body, context)
  {
    console.log("checkGuest called",body);
    let self = this;
    let observable = this.guests.getGuestList({name: body.result.parameters.name});
    let guests = [];
    observable.subscribe(
    {
      next: (guest) => {guests.push(guest);},
      error: (err) => {context.succeed(this.error500);},
      complete: () =>
      {
        if(guests.length > 0)
        {
          context.succeed(
          {
            statusCode: 200,
            body: JSON.stringify(
            {
              //come sopra
              contextOut: [
              {
                name: 'welcome',  //forse da cambiare, welcome è già context di default per facebook e simili
                lifespan: 0,  //dura solo 1 interazione e poi sparisce
                parameters:
                {
                  company: guests[0].company //metto come possibile azienda la prima. Nel caso l'utente potrà dire che appartiene ad un'altra azienda
                }
              }],
              data: Object.assign({ _status: 200}, (body.originalRequest ? body.originalRequest.data : {})),
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

  /**
  * metodo privato utilizzato per mandare la risposta di default nel caso in cui la persona con cui sta avvenendo la conversazione
  * non sia né un amministratore né un ospite chje ha visitato precedentemente l'azienda
  * @param {ApiAiRequestBody} body - contiene i dati della richiesta fatta da api.ai al webhook
  * @param {lambdaContext} context - permette di inviare una risposta ad api gateway
  */
  _defaultResponse(body, context)
  {
    context.succeed(
    {
      statusCode: 200,
      body: JSON.stringify(
      {
        speech: body.result.fulfillment.speech,
        displayText: body.result.fulfillment.displayText,
        data: Object.assign({ _status: 200 }, (body.originalRequest ? body.originalRequest.data : {})),
        followupEvent: {name: "companyQuestionEvent", data: {"name": body.result.parameters.name}}
      })
    });
  }
}

module.exports = ConversationWebhookService;


/**********************
 * COSTANTI ERRORI
 *********************/

/*
 * HEADERS CORS, non so se servano effettivamente, nel caso si possono abilitare ed aggiungere alle varie chiamate
 * a context.succeed
 *
let headers =
{
  "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
  "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
}*/
