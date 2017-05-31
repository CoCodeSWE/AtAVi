class CmdRunner
{

  constructor(next)
  {
    this.next = next;
  }
  /**
   * handler - metodo che gestisce la chain of responsibiliity. Viene chiamato dalle
   * classi che eridatano da questa nel caso in cui la action non sia gestita, e si
   * occupa di chiamare il prossimo runner
   *
   * @param  {String} action azione da eseguire
   * @param  {Object} body   oggetto contenete il corpo della richiesta ricevuta
   * @param  {type} params parametri ricevuti dall'assistente virtuale
   * @return {type}        description
   */
  handler(response, body)
  {
    if(this.next)
      return this.next.handler(response, body);
    return false;
  }
  /**
  * metodo che viene chiamato ogni volta viene ricevuta una risposta dall'assitente virtuale
  * @param {LambdaContext} context - oggetto utilizzato per mandare l'eventuale risposta ad API gateway
  * @param {Buffer} body - corpo della richiesta ricevuta, contenente anche un buffer dell'audio in body.audio (al posto dell'audio codificato in base64 delle richiesta originale)
  * @return {function(VAResponse)} - funzione utilizzata come callback, che accetta come parametro la risposta dell'assistente viruale
  */
  /*
  _onVaResponse(context, body)
  {
    let self = this;
    return function(response) //restituisce
    {
      console.log('response: ', JSON.stringify(response, null, 2));
      let options =
      {
        method: 'POST',
        uri: VA_SERVICE_URL,
        headers:{'x-api-key': VA_SERVICE_KEY},
        json: true,
        body:
        {
          app: body.app,  //body.app contiene il nome dell'applicazione originale
          query:
          {
            data: response.res.data ? response.res.data : {}, //copio  i dati della risposta dell'assistente virtuale
            session_id: response.session_id
          }
        }
      }

      let params = (response.res.contexts && response.res.contexts[0]) ? response.res.contexts[0].parameters : {};
      switch(response.action)
      {
        case 'app.switch':  // transizione tra diverse applicazioni
          if(params.new_app)
          {
            options.body.app = params.new_app;  //cambio app, in modo che venga interrogato l'agent adeguato
            body.app = params.new_app;  //in questo caso il cambiamento di agent è permesso, quindi aggiorno il nome dell'applicazione originale
            delete params.new_app;
            options.body.query.event = { name: 'init', data: params };
            console.log('options: ', options);
            self.request_promise(options).then(self._onVaResponse(context, body).bind(self)).catch(error(context));
            break;
          }
        default:  //nel caso in cui l'azione non sia da gestire nel back-end, inoltro la risposta dell'assistente virtuale al client
          this.sns.publish({Message: JSON.stringify(response), TopicArn: SNS_TOPIC_ARN},(err, data) =>
          {
            if(err)
              (error(context))({ code: 500, msg: 'Cannot notify: ' + JSON.stringify(err, null, 2)});
            else
            {
              response.res.text_request = self.text_request;
              context.succeed({ statusCode: 200, headers: { "Access-Control-Allow-Origin" : "*", "Access-Control-Allow-Credentials" : true }, body: JSON.stringify(response) });
            }
          });
      }
    }*/
    // Viene ritornata una query string contenente i dati dell'oggetto obj
  queryString(obj)
  {
    let str = [];
    for(let p in obj)
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    return str.join("&");
  }
}

module.exports = CmdRunner;
