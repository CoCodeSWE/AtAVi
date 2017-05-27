/**
* Questa classe si occupa di implementare l'endpoint dell'API Gateway utilizzato dal client vocale.
* @author Simeone Pizzi, Nicola Tintorri e Mattia Bottaro
* @version 0.0.5
* @since 0.0.3-alpha
* @todo gestione degli errori un po' più pensata
* @todo retry delle richieste (utilizzando magari promise-retry {@see https://www.npmjs.com/package/promise-retry})
*/
const Rx = require('rxjs/Rx');


const VA_SERVICE_URL = process.env.VA_SERVICE_URL;
const VA_SERVICE_KEY = process.env.VA_SERVICE_KEY;

class VocalAPI
{
  /**
  * Costruttore della classe che implementa la logica dell'api gateway
  * @param {VocalLoginModule} vocal - Modulo utilizzato per effettuare il login vocale degli amministratori
  * @param {JsonWebTokenModule} jwt - Modulo utilizzato per la creazione di JWT
  * @param {RequestPromisModule} rp - Modulo utilizzato per effettuare richieste http ai microservizi utilizzando le Promise
  * @param {STTModule} stt - Modulo utilizzato per la conversione di un file audio in testo
  * @param {AWS.SNS} sns - Modulo utilizzato per pubblicare i dati della interazione su un topic SNS
  * @param {CmdRunner} runner - Command Runner utilizzato per eseguire i comandi restituiti dall'assistente virtuale
  */
  constructor(vocal, jwt, rp, stt, sns, runner)
  {
    //this.vocal = vocal;
    this.request_promise = rp;
    //this.sns = sns;
    this.stt = stt;
    //this.jwt = jwt;
    this.runner = runner;
  }

	/**
	* Questa classe si occupa di implementare l'endpoint dell'API Gateway utilizzato dal client vocale
	* @param {LambdaEvent} event - Parametro contenente, all'interno del campo body sotto forma di stringa in formato JSON, un oggetto contenente tutti i dati relativi ad un messaggio ricevuto da API Gateway
	* @param {LambdaContext} context - Parametro utilizzato dalle lambda function per inviare la risposta
	*/
  queryLambda(event, context)
  {
    console.log(event);
    let self = this;
    let body;
    try
    {
      body = JSON.parse(event.body);
    }
    catch(err)  //non è un JSON valido, quindi la richiesta non è conforme
    {
      context.succeed(
			{
				statusCode: 400,
        headers: { "Access-Control-Allow-Origin" : "*", "Access-Control-Allow-Credentials" : true },
				body: JSON.stringify({ "message": "Bad Request: \n" + JSON.stringify(err, null, 2) })
			});
      return;
    }
    body.audio = Buffer.from(body.audio, 'base64'); //converto da stringa in base64 a Buffer
    self.stt.speechToText(body.audio, 'audio/l16; rate=16000').then(function(text)  //quando ho il testo interrogo l'assistente virtuale
    {
      let query = {data: body.data, session_id: body.session_id};
      if(text)
      {
        self.text_request = text;
        query.text = text;
      }
      else
      {
        self.text_request = '';
        query.event = {name: 'fallbackEvent', data:{}};
      }
      let req_options =
      {
        method: 'POST',
        uri: VA_SERVICE_URL,
        body:
        {
          app: body.app,
          query: query
        },
        headers:
        {
          'x-api-key': VA_SERVICE_KEY
        },
        json: true
      }
      console.log(JSON.stringify(req_options, null, 2));
      return self.request_promise(req_options) //il prossimo then riceverà direttamente la risposta dell'assistente virtuale
    })
      .catch(function(err)
      {
        console.log(err);
        if(err.name === 'StatusCodeError')
          context.succeed({statusCode: err.statusCode, headers: { "Access-Control-Allow-Origin" : "*", "Access-Control-Allow-Credentials" : true }, body: JSON.stringify({message: 'Internal server error.'})});
        else
          context.succeed({statusCode: 404, headers: { "Access-Control-Allow-Origin" : "*", "Access-Control-Allow-Credentials" : true }, body: JSON.stringify({message: 'Internal server error.'})});
        throw(null);
      })
      .then(self._onResponse(context, body).bind(self))
      .catch(function(err)
      {
        console.log(err);
        if(err)
          context.succeed({statusCode: 500, headers: { "Access-Control-Allow-Origin" : "*", "Access-Control-Allow-Credentials" : true }, body: JSON.stringify({message: 'Internal server error.'})});
      });
  }
  //context.succeed(statusCode: 200, body: JSON.stringify(response));

  queryText(event, context)
  {
    console.log('queryText called');
    let self = this;
    let body;
    try
    {
      body = JSON.parse(event.body);
    }
    catch(err)  //non è un JSON valido, quindi la richiesta non è conforme
    {
      context.succeed(
			{
				statusCode: 400,
        headers: { "Access-Control-Allow-Origin" : "*", "Access-Control-Allow-Credentials" : true },
				body: JSON.stringify({ "message": "Bad Request" })
			});
      return;
    }
    self.text_request = body.text;
    console.log("text: ", self.text_request);
    let req_options =
    {
      method: 'POST',
      uri: VA_SERVICE_URL,
      body:
      {
        app: body.app,
        query:
        {
          text: self.text_request,
          session_id: body.session_id,
          data: body.data
        }
      },
      headers:
      {
        'x-api-key': VA_SERVICE_KEY
      },
      json: true
    }
    self.request_promise(req_options)
      .then(self._onResponse(context, body).bind(self))
      .catch(function(err)
      {
        console.log(err);
        if(err)
          context.succeed({statusCode: 500, headers: { "Access-Control-Allow-Origin" : "*", "Access-Control-Allow-Credentials" : true }, body: JSON.stringify({message: 'Internal server error.'})});
      });
  }

  _onError(context)
  {
    return function(err)
    {
      console.log(err);
      context.succeed({statusCode: err.code, headers: { "Access-Control-Allow-Origin" : "*", "Access-Control-Allow-Credentials" : true }, body: JSON.stringify(err.msg)});
    }
  }

  _onResponse(context, body)
  {
    let self = this;
    return function(query)
    {
      if(query)
      {
        if(query.data)
          query.data = Object.assign(query.data, body.data)
        else
          query.data = body.data;
        let options =
        {
          method: 'POST',
          uri: VA_SERVICE_URL,
          body:
          {
            app: body.app,
            query: query
          },
          headers:
          {
            'x-api-key': VA_SERVICE_KEY
          },
          json: true
        }
        self.request_promise(options).then(function(response)
        {
          let action = response.action;
          let params = (response.res.contexts && response.res.contexts[0]) ? response.res.contexts[0].parameters : {};
          let promise = self.runner.handle(action, body, params);
          if(promise)
            promise.then(self._onResponse(context, body).bind(self)).catch(self._onError(context));
          else  /**@todo forse bisogna aggiungere la richiesta*/
            context.succeed({statusCode: 200, headers: { "Access-Control-Allow-Origin" : "*", "Access-Control-Allow-Credentials" : true }, body: JSON.stringify(response)});
        }).catch(console.log);
      }
    }
  }
}

module.exports = VocalAPI;
