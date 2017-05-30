const VER_TOK = process.env.VER_TOK; // token di verifica di slack, utilizzato per essere sicuri che la chiamata provenga da slack
const NOTIFICATIONS_SERVICE_URL = process.env.NOTIFICATIONS_SERVICE_URL;
const NOTIFICATIONS_SERVICE_KEY = process.env.NOTIFICATIONS_SERVICE_KEY;

class SlackAPI
{
  constructor(va_module, rp)
  {
    this.va_module = va_module;
    this.request_promise = rp;
  }

  post(event, context)
  {
    let body;
    try
    {
      body = JSON.parse(event.body);
    }
    catch(err)
    {
      this._send(context, 400, 'Bad request: ' + JSON.stringify(err)); //Bad request
    }
    console.log(body);
    if(body.type && body.token && body.token === VER_TOK) // controllo che siano presenti i dati minimi e che il token sia corretto
    {
      switch(body.type)
      {
        case 'url_verification': this._challenge(body, context); break;
        case 'event_callback': this._message(body, context); break; /**@todo controllare anche il tipo dentro a event*/
        default: this._send(context, 400, 'Bad Request: unknown type');
      }
    }
    else
      this._send(context, 400, 'Bad request: no type specified'); //Bad request
  }

  _challenge(body, context)
  {
    context.succeed(
    {
      headers: {'Content-Type': 'application/json'},
      statusCode: 200,
      body: JSON.stringify({challenge: body.challenge})
    });
  }

  _message(body, context)
  {
    {
      if(body.event && body.event.type && body.event.type === 'message')
      {
        let options =
        {
          method: 'POST'
        }
        this._send(context, 200, '');
      }
    }
  }

  _send(context, status, message)
  {
    context.succeed({ statusCode: status, body: JSON.stringify({msg: message})});
  }
}

module.exports = SlackAPI;
