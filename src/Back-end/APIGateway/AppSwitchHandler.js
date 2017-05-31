const CmdRunner = require('./CmdRunner');

class AppSwitchHandler extends CmdRunner
{
  handler(response, body)
  {
    return new Promise((resolve, reject) =>
    {
      let action;
      let params;
      if(response && response.res)
      {
        action = response.action;
        params = (response.res.contexts && response.res.contexts[0]) ? response.res.contexts[0].parameters : {};
      }
      if(action && params && action === 'app.switch' && params.new_app)
      {
        body.app = params.new_app;
        delete params.new_app;
        let query = { event: { name: 'init', data: params }, data: response.res.data ? response.res.data : {} };
        resolve(query);
      }
      else
        resolve(super.handler(response, body));
    });
  }
}

module.exports = AppSwitchHandler;
