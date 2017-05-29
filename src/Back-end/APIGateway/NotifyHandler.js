const CmdRunner = require('./CmdRunner');
const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN;

class NotifyHandler extends CmdRunner
{
  constructor(next, sns)
  {
    super(next);
    this.sns = sns;
  }

  handler(response, body)
  {
    return new Promise((resolve, reject) =>
    {
      if(response)
      {
        this.sns.publish({Message: JSON.stringify(response), TopicArn: SNS_TOPIC_ARN},(err, data) =>
        {
          if(err)
            reject(err);
          else
            resolve(super.handler(response, body));
          //this.callback(null, null, { statusCode: 200, headers: { "Access-Control-Allow-Origin" : "*", "Access-Control-Allow-Credentials" : true }, body: JSON.stringify(response) });
        });
      }
      else
        resolve(super.handler(null, body));
    });
  }
}

/**
* funzione di utilità utilizzata per restituire un codice d'errore nel caso in cui
* ci sia qualche problema. Forse dovrebbe essere modificata per utilizzare un
* evento dell'assistente virtuale??
* @param {LambdaContext} context - oggetto utilizzato per ritornare la risposta
* contenente il codice d'errore
*/
function error(context)
{
  return function(err)
  {
    console.log(err);
    context.succeed(
    {
      statusCode: err.code,
      headers: { "Access-Control-Allow-Origin" : "*", "Access-Control-Allow-Credentials" : true },
      body: JSON.stringify({ message: err.msg })
    });
  }
}

module.exports = NotifyHandler;
