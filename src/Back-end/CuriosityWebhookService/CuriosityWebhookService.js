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
     * @param {GuestsDAO} guests - DAO utilizzato per l'accesso ai dati relativi ai guests
     */
    constructor(curiosities,guests)
    {
      this.curiosities = curiosities;
      this.guests = guests;
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
        case 'curiosity.sport':
        {
          this._sportCuriosity(body, context);
          break;
        }
        case 'curiosity.technology':
        {
          this._technologyCuriosity(body, context);
          break;
        }
        case 'curiosity.food':
        {
          this._foodCuriosity(body, context);
          break;
        }
        case 'curiosity.general':
        {
          this._generalCuriosity(body, context);
          break;
        }
        case 'curiosity.firstGeneral':
        {
          this._firstGeneralCuriosity(body, context);
          break;
        }
        case 'curiosity.emptyFood':
        {
          this._foodEmptyCuriosity(body, context);
          break;
        }
        // mancherebbe un'azione di default. Ma vorrebbe dire che arriva una action non gestita.
      }
    }


  /**
  * metodo privato utilizzato per restituire una curiosità di tipo "sport"
  * @param {ApiAiRequestBody} body - contiene i dati della richiesta fatta da api.ai al webhook
  * @param {lambdaContext} context - permette di inviare una risposta ad api gateway
  */

  _sportCuriosity(body, context)
  {
    let guest = {};
    let curiosity_from_db = {};
    let observable_guest = this.guests.getGuest(body.result.parameters.name, body.result.parameters.company);
    observable_guest.subscribe(
    {
      next: (data) => {guest = data;},
      error: (err) => {context.succeed(this.error500);},
      complete:  () =>
      {
        let numeric_id = guest.sport;
        let id = 'SPORT' + (numeric_id + 1);
        let observable = this.curiosities.getCuriosity('sport',id);
        observable.subscribe(
          {
            next: (curiosity) => {curiosity_from_db = curiosity;},
            error: (err) =>
            {
              if(err.code && err.code === 'Not found'){
                context.succeed(
                  {
                    statusCode: 200,
                    body: JSON.stringify(
                      {
                        speech: body.result.fulfillment.speech,
                        displayText: body.result.fulfillment.displayText,
                        data: Object.assign({ _status: 200 }, (body.originalRequest ? body.originalRequest.data : {})),
                        followupEvent: {name: "emptySportCuriosityEvent", data: {"name": body.result.parameters.name,
                        "company": body.result.parameters.company, "required_person": body.result.parameters.required_person}}
                      })
                    });
                  }
                  context.succeed(this.error500);
                },
                complete: () =>
                {
                  guest.sport = parseInt(curiosity_from_db.id.slice(5)); //prendo l'id numerico togliendo SPORT
                  let observable_update = this.guests.updateGuest(guest);
                  observable_update.subscribe(
                    {
                      error: (err) => {context.succeed(this.error500);}
                    }
                  );
                  context.succeed(
                  {
                      statusCode: 200,
                      body: JSON.stringify(
                      {
                          speech: body.result.fulfillment.speech,
                          displayText: body.result.fulfillment.displayText,
                          data: Object.assign({ _status: 200 }, (body.originalRequest ? body.originalRequest.data : {})),
                          followupEvent: {name: "sportCuriosityEvent", data: {"text": curiosity_from_db.text, "type": curiosity_from_db.type, "name": body.result.parameters.name,
                          "company": body.result.parameters.company, "required_person": body.result.parameters.required_person}}
                      })
                  });
                }
              });

      }
  }
)
}

/**
* metodo privato utilizzato per restituire una curiosità di tipo "tecnhology"
* @param {ApiAiRequestBody} body - contiene i dati della richiesta fatta da api.ai al webhook
* @param {lambdaContext} context - permette di inviare una risposta ad api gateway
*/

_technologyCuriosity(body, context)
{
let guest = {};
let curiosity_from_db = {};
let observable_guest = this.guests.getGuest(body.result.parameters.name, body.result.parameters.company);
observable_guest.subscribe(
  {
      next: (data) => {guest = data;},
      error: (err) => {context.succeed(this.error500);},
      complete:  () =>
      {
        let numeric_id = guest.technology;
        let id = 'TECHNOLOGY' + (numeric_id + 1);
        let observable = this.curiosities.getCuriosity('technology',id);
        observable.subscribe(
          {
            next: (curiosity) => {curiosity_from_db = curiosity;},
            error: (err) =>
            {
              if(err.code && err.code === 'Not found'){
                context.succeed(
                  {
                    statusCode: 200,
                    body: JSON.stringify(
                      {
                        speech: body.result.fulfillment.speech,
                        displayText: body.result.fulfillment.displayText,
                        data: Object.assign({ _status: 200 }, (body.originalRequest ? body.originalRequest.data : {})),
                        followupEvent: {name: "emptyTechnologyCuriosityEvent", data: {"name": body.result.parameters.name,
                        "company": body.result.parameters.company, "required_person": body.result.parameters.required_person}}
                      })
                    });
                  }
                  context.succeed(this.error500);
                },
                complete: () =>
                {
                  guest.technology = parseInt(curiosity_from_db.id.slice(10)); //prendo l'id numerico togliendo TECHNOLOGY
                  let observable_update = this.guests.updateGuest(guest);
                  observable_update.subscribe(
                    {
                      error: (err) => {context.succeed(this.error500);}
                    }
                  );
                  context.succeed(
                  {
                      statusCode: 200,
                      body: JSON.stringify(
                      {
                          speech: body.result.fulfillment.speech,
                          displayText: body.result.fulfillment.displayText,
                          data: Object.assign({ _status: 200 }, (body.originalRequest ? body.originalRequest.data : {})),
                          followupEvent: {name: "technologyCuriosityEvent", data: {"text": curiosity_from_db.text, "type": curiosity_from_db.type, "name": body.result.parameters.name,
                          "company": body.result.parameters.company, "required_person": body.result.parameters.required_person}}
                      })
                  });
                }
              });

      }
  }
)
}

/**
* metodo privato utilizzato per restituire una curiosità di tipo "food"
* @param {ApiAiRequestBody} body - contiene i dati della richiesta fatta da api.ai al webhook
* @param {lambdaContext} context - permette di inviare una risposta ad api gateway
*/

_foodCuriosity(body, context)
{
let guest = {};
let curiosity_from_db = {};
let observable_guest = this.guests.getGuest(body.result.parameters.name, body.result.parameters.company);
observable_guest.subscribe(
  {
      next: (data) => {guest = data;},
      error: (err) => {context.succeed(this.error500);},
      complete:  () =>
      {
        let numeric_id = guest.food;
        let id = 'FOOD' + (numeric_id + 1);
        let observable = this.curiosities.getCuriosity('food',id);
        observable.subscribe(
          {
            next: (curiosity) => {curiosity_from_db = curiosity;},
            error: (err) =>
            {
              if(err.code && err.code === 'Not found'){
                context.succeed(
                  {
                    statusCode: 200,
                    body: JSON.stringify(
                      {
                        speech: body.result.fulfillment.speech,
                        displayText: body.result.fulfillment.displayText,
                        data: Object.assign({ _status: 200 }, (body.originalRequest ? body.originalRequest.data : {})),
                        followupEvent: {name: "emptyFoodCuriosityEvent", data: {"name": body.result.parameters.name,
                        "company": body.result.parameters.company, "required_person": body.result.parameters.required_person}}
                      })
                    });
                  }
                  context.succeed(this.error500);
                },
                complete: () =>
                {
                  guest.food = parseInt(curiosity_from_db.id.slice(4)); //prendo l'id numerico togliendo FOOD
                  let observable_update = this.guests.updateGuest(guest);
                  observable_update.subscribe(
                    {
                      error: (err) => {context.succeed(this.error500);}
                    }
                  );
                  context.succeed(
                  {
                      statusCode: 200,
                      body: JSON.stringify(
                      {
                          speech: body.result.fulfillment.speech,
                          displayText: body.result.fulfillment.displayText,
                          data: Object.assign({ _status: 200 }, (body.originalRequest ? body.originalRequest.data : {})),
                          followupEvent: {name: "foodCuriosityEvent", data: {"text": curiosity_from_db.text, "type": curiosity_from_db.type, "name": body.result.parameters.name,
                          "company": body.result.parameters.company, "required_person": body.result.parameters.required_person}}
                      })
                  });
                }
              });

      }
  }
)
}

/**
* metodo privato utilizzato per restituire una curiosità di tipo "general"
* @param {ApiAiRequestBody} body - contiene i dati della richiesta fatta da api.ai al webhook
* @param {lambdaContext} context - permette di inviare una risposta ad api gateway
*/

_generalCuriosity(body, context)
{
  let guest = {};
  let curiosity_from_db = {};
  let observable_guest = this.guests.getGuest(body.result.parameters.name, body.result.parameters.company);
  observable_guest.subscribe(
  {
    next: (data) => {guest = data;},
    error: (err) => {context.succeed(this.error500);},
    complete:  () =>
    {
      let numeric_id = guest.general;
      let id = 'GENERAL' + (numeric_id + 1);
      let observable = this.curiosities.getCuriosity('general',id);
      observable.subscribe(
      {
        next: (curiosity) => {curiosity_from_db = curiosity;},
        error: (err) =>
        {
          if(err.code && err.code === 'Not found')
          {
            context.succeed(
            {
              statusCode: 200,
              body: JSON.stringify(
              {
                speech: body.result.fulfillment.speech,
                displayText: body.result.fulfillment.displayText,
                data: Object.assign({ _status: 200 }, (body.originalRequest ? body.originalRequest.data : {})),
                followupEvent: {name: "emptyGeneralCuriosityEvent", data: {"name": body.result.parameters.name,
                "company": body.result.parameters.company, "required_person": body.result.parameters.required_person}}
              })
            });
          }
          context.succeed(this.error500);
          },
          complete: () =>
          {
            guest.general = parseInt(curiosity_from_db.id.slice(7)); //prendo l'id numerico togliendo GENERAL
            let observable_update = this.guests.updateGuest(guest);
            observable_update.subscribe(
                {
                  error: (err) => {context.succeed(this.error500);}
                }
              );
            context.succeed(
            {
              statusCode: 200,
              body: JSON.stringify(
              {
                speech: body.result.fulfillment.speech,
                displayText: body.result.fulfillment.displayText,
                data: Object.assign({ _status: 200 }, (body.originalRequest ? body.originalRequest.data : {})),
                followupEvent: {name: "genealCuriosityEvent", data: {"text": curiosity_from_db.text, "type": curiosity_from_db.type, "name": body.result.parameters.name,
                "company": body.result.parameters.company, "required_person": body.result.parameters.required_person}}
              })
            });
          }
        });
      }
    });
  }

  /**
  * metodo privato utilizzato per restituire una curiosità di tipo "general". Viene invocato solo
  se l'utente ha detto che non gli piace il cibo (lo capiamo tramite una appostia action), in maniera tale da poter dire una frase simpatica
  * @param {ApiAiRequestBody} body - contiene i dati della richiesta fatta da api.ai al webhook
  * @param {lambdaContext} context - permette di inviare una risposta ad api gateway
  */

  _firstGeneralCuriosity(body, context)
  {
    let guest = {};
    let curiosity_from_db = {};
    let observable_guest = this.guests.getGuest(body.result.parameters.name, body.result.parameters.company);
    observable_guest.subscribe(
    {
      next: (data) => {guest = data;},
      error: (err) => {context.succeed(this.error500);},
      complete:  () =>
      {
        let numeric_id = guest.general;
        let id = 'GENERAL' + (numeric_id + 1);
        let observable = this.curiosities.getCuriosity('general',id);
        observable.subscribe(
        {
          next: (curiosity) => {curiosity_from_db = curiosity;},
          error: (err) =>
          {
            if(err.code && err.code === 'Not found')
            {
              context.succeed(
              {
                statusCode: 200,
                body: JSON.stringify(
                {
                  speech: body.result.fulfillment.speech,
                  displayText: body.result.fulfillment.displayText,
                  data: Object.assign({ _status: 200 }, (body.originalRequest ? body.originalRequest.data : {})),
                  followupEvent: {name: "emptyGeneralCuriosityEvent", data: {"name": body.result.parameters.name,
                        "company": body.result.parameters.company, "required_person": body.result.parameters.required_person}}
                })
              });
            }
            context.succeed(this.error500);
          },
          complete: () =>
          {
            guest.general = parseInt(curiosity_from_db.id.slice(7)); //prendo l'id numerico togliendo GENERAL
            let observable_update = this.guests.updateGuest(guest);
            observable_update.subscribe(
              {
                error: (err) => {context.succeed(this.error500);}
              }
            );
            context.succeed(
            {
              statusCode: 200,
              body: JSON.stringify(
              {
                speech: "Are you kidding me? Everybody loves food! By the way... "+body.result.fulfillment.speech,
                displayText: "Are you kidding me? Everybody loves food! By the way... "+body.result.fulfillment.displayText,
                data: Object.assign({ _status: 200 }, (body.originalRequest ? body.originalRequest.data : {})),
                followupEvent: {name: "generalCuriosityEvent", data: {"text": "Are you kidding me? Everybody loves food! By the way... "+curiosity_from_db.text, "type": curiosity_from_db.type, "name": body.result.parameters.name,
                "company": body.result.parameters.company, "required_person": body.result.parameters.required_person}}
              })
            });
          }
        });
      }
    });
  }

  /**
  * metodo privato utilizzato per restituire una curiosità di tipo "general". Viene invocato solo
  * se il webhook che recupera una curiosità sul cibo ritorna un risultato vuoto (perchè le ha dette tutte
  * o perchè non ce ne sono più).
  * @param {ApiAiRequestBody} body - contiene i dati della richiesta fatta da api.ai al webhook
  * @param {lambdaContext} context - permette di inviare una risposta ad api gateway
  */

  _foodEmptyCuriosity(body, context)
  {
    let guest = {};
    let curiosity_from_db = {};
    let observable_guest = this.guests.getGuest(body.result.parameters.name, body.result.parameters.company);
    observable_guest.subscribe(
    {
      next: (data) => {guest = data;},
      error: (err) => {context.succeed(this.error500);},
      complete:  () =>
      {
        let numeric_id = guest.general;
        let id = 'GENERAL' + (numeric_id + 1);
        let observable = this.curiosities.getCuriosity('general',id);
        observable.subscribe(
        {
          next: (curiosity) => {curiosity_from_db = curiosity;},
          error: (err) =>
          {
            if(err.code && err.code === 'Not found')
            {
              context.succeed(
              {
                statusCode: 200,
                body: JSON.stringify(
                {
                  speech: body.result.fulfillment.speech,
                  displayText: body.result.fulfillment.displayText,
                  data: Object.assign({ _status: 200 }, (body.originalRequest ? body.originalRequest.data : {})),
                  followupEvent: {name: "emptyGeneralCuriosityEvent", data: {"name": body.result.parameters.name,
                        "company": body.result.parameters.company, "required_person": body.result.parameters.required_person}}
                })
              });
            }
            context.succeed(this.error500);
          },
          complete: () =>
          {
            guest.general = parseInt(curiosity_from_db.id.slice(7)); //prendo l'id numerico togliendo GENERAL
            let observable_update = this.guests.updateGuest(guest);
            observable_update.subscribe(
              {
                error: (err) => {context.succeed(this.error500);}
              }
            );
            context.succeed(
            {
              statusCode: 200,
              body: JSON.stringify(
              {
                speech: body.result.fulfillment.speech,
                displayText: body.result.fulfillment.displayText,
                data: Object.assign({ _status: 200 }, (body.originalRequest ? body.originalRequest.data : {})),
                followupEvent: {name: "generalCuriosityEvent", data: {"text": "I'm sorry, I don't know anything else about food. Don't worry and listen to this: "+curiosity_from_db.text, "type": curiosity_from_db.type, "name": body.result.parameters.name,
                "company": body.result.parameters.company, "required_person": body.result.parameters.required_person}}
              })
            });
          }
        });
      }
    });
  }
}
  module.exports = CuriosityWebhookService;
