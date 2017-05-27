/*const VER_TOK = process.env.VER_TOK; // token di verifica di slack, utilizzato per essere sicuri che la chiamata provenga da slack

class SlackAPI
{
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
    if(body.type && body.token && body.token === VER_TOK) // controllo che siano presenti i dati minimi e che il token sia corretto
    {
      switch(body.type)
      {
        case 'url_verification': this._challenge(body, context); break;
        case 'event_callback': this._message(body, context); break;
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
      headers: {'Content-Type:', 'application/json'},
      statusCode: 200,
      body: JSON.stringify({challenge: body.challenge})
    });
  }

  _message()
  {

  }

  _send(context, status, message)
  {
    context.succeed({statusCode: status, body: JSON.stringify({ msg: message}));
  }
}*/
