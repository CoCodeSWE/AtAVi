class VocalAPI
{
  constructor(vocal, jwt, rp, stt, sns)
  {
    this.vocal = vocal;
    this.request_promise = rp;
    this.sns = sns;
    this.stt = stt;
    this.jwt = jwt;
  }

  query(event, context)
  {
    let body = JSON.parse(event.body);
    let action = Math.floor(Math.random() * 2);
    let result;
    switch(action)
    {
      case 0:
        result = this.method0();
        break;
      case 1:
        result = this.method1();
        break;
      default:
        result = 'default';
    }
    console.log(result, action);
    context.succeed({statusCode: 200, body: result});
  }

  method0()
  {
    return 'method 0';
  }

  method1()
  {
    return 'method1';
  }
}

module.exports = VocalAPI;
