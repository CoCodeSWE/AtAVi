const CmdRunner = require('./CmdRunner');

class AppSwitchHandler extends CmdRunner
{
  handler(response, body)
  {
    let action = response.action;
    let params = (response.res.contexts && response.res.contexts[0]) ? response.res.contexts[0].parameters : {};
    return new Promise((resolve, reject) =>
    {
      if(action === 'app.switch' && params.new_app)
      {
        body.app = params.new_app;
        delete params.new_app;
        let query = { event: { name: 'init', data: params } };
        console.log('options: ', options);
        resolve(query);
      }
      else
        resolve(super.handler(response, body));
    });
  }
}

module.exports = AppSwitchHandler;
