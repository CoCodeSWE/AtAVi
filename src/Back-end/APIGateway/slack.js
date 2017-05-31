const VER_TOK = process.env.VER_TOK; // token di verifica di slack, utilizzato per essere sicuri che la chiamata provenga da slack
const NOTIFICATIONS_SERVICE_URL = process.env.NOTIFICATIONS_SERVICE_URL;
const NOTIFICATIONS_SERVICE_KEY = process.env.NOTIFICATIONS_SERVICE_KEY;
const USERS_SERVICE_URL = process.env.USERS_SERVICE_URL;
const USERS_SERVICE_KEY = process.env.USERS_SERVICE_KEY;
const JWT_SECRET = process.env.JWT_SECRET;

class SlackAPI
{
  constructor(va_module, rp, jwt)
  {
    this.va_module = va_module;
    this.request_promise = rp;
    this.jwt = jwt;
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
          method: 'POST',
          uri: VA_SERVICE_URL,
          headers: {'x-api-key': VA_SERVICE_KEY},
          body:
          {
            app: 'admin',
            query:
            {
              data:
              {
                token: VER_TOKEN
              }
              text: body.event.text,
              session_id: body.event.user //usiamo user id come id di sessione, tanto dopo 20 minuti circa la sessione scade e non ci sono più sessioni per utente
            }
          }
        };
        this.request_promise(options).then(response)
        {
          
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
