const CmdRunner = require('./CmdRunner');
const RULES_SERVICE_KEY = process.env.RULES_SERVICE_KEY;
const RULES_SERVICE_URL = process.env.RULES_SERVICE_URL;
const WRONG_APP = { code: 400, msg: 'Reserved action name' }

class RuleHandler extends CmdRunner
{
  constructor(next, rp)
  {
    super(next);
    this.request_promise = rp;
  }

  handler(response, body)
  {
    return new Promise((resolve, reject) =>
    {
      if(!response)
        resolve(super.handler(null, body));
      else
      {
        let params = (response.res.contexts && response.res.contexts[0]) ? response.res.contexts[0].parameters : {};
        let action = response.action;
        switch(action)
        {
          case 'rule.add':
            if(body.app === 'admin')
            {
              let query = { event: { name: 'addRuleSuccess', data: {} } };
              this._addRule(
              {
                name: params.rule_name,
                task:
                {
                  type: params.task_name
                },
                targets:[
                {
                  name: params.target_name,
                  member: params.target_member,
                  company: params.target_company
                }],
                enabled: true
              }).subscribe(
              {
                complete: () =>
                {
                  resolve(query);
                },
                error: reject
              });
            }
            else
              reject(WRONG_APP);
            break;
          case 'rule.getList':
            if(body.app === 'admin')
            {
              let rules;
              let query = { event: {name: 'getRuleListSuccess'} };
              this._getRuleList(/*dd*/).subscribe(
              {
                next: (data) => {rules = data},
                error: reject,
                complete: () =>
                {
                  query.event.data = { rules: rules };
                  resolve(query);
                }
              });
            }
            else
              reject(WRONG_APP);
            break;
          case 'rule.get':
            if(body.app === 'admin')
            {
              let rule;
              let query = { event: {name: 'getSuccess'} };
              this._getRule(params.id).subscribe(
              {
                next: (data) => {rule = data;},
                error: reject,
                complete: () =>
                {
                  query.event.data = { rule: rule };
                  resolve(query);
                }
              });
            }
            else
              reject(WRONG_APP);
            break;
          case 'rule.remove':
            if(body.app === 'admin')
            {
              let query = { event: {name: 'removeRuleSuccess', data: {} }};
              this._removeRule(params.rule_id).subscribe(
              {
                complete: () =>
                {
                  resolve(query);
                },
                error: reject
              });
            }
            else
              reject(WRONG_APP);
            break;
          case 'rule.update':
            if(body.app)
            {
              let query = { event: {name: 'updateRuleSuccess', data: {}}};
              this._updateRule(
              {
                name: params.rule_name,
                task:
                {
                  type: params.task_name
                },
                targets:[
                {
                  name: params.target_name,
                  member: params.target_member,
                  company: params.target_company
                }],
                enabled: true
              }).subscribe(
              {
                complete: () =>
                {
                  resolve(query);
                },
                error: error(context)
              });
            }
            else
              reject(WRONG_APP);
            break;
          default:
            resolve(super.handler(response, body));
        }
      }
    });
  }

  /**
  * Metodo che permette di aggiungere una direttiva al sistema
  * @param {Rule} rule - direttiva da aggiungere
  */
  _addRule(rule)
  {
		let self = this;
		return new Rx.Observable(function(observer)
		{
			let options =
			{
				method: 'POST',
				uri: RULES_SERVICE_URL,
				body: rule,
        headers:{'x-api-key': RULES_SERVICE_KEY},
				json: true
			};

			self.request_promise(options).then(function(data)
			{
        console.log(data);
				observer.complete();
			})
			.catch(function(err)
			{
        console.log('error: ', err)
				observer.error(
				{
					code: err.statusCode,
					msg: err.message
				});
			});
		});
  }

  /**
  * Metodo che permette di ottenere una direttiva al sistema
  * @param {String} id - id della direttiva richiesta
  */
  _getRule(id)
  {
		let self = this;
		return new Rx.Observable(function(observer)
		{
			let options =
			{
				method: 'GET',
				uri: `${RULES_SERVICE_URL}/${id}`,
        headers:{'x-api-key': RULES_SERVICE_KEY},
				json: true
			};

			self.request_promise(options).then(function(data)
			{
        observer.next(data);
				observer.complete();
			})
			.catch(function(err)
			{
				observer.error(
				{
					code: err.statusCode,
					msg: err.message
				});
			});
		});
  }

  /**
  * Metodo che permette di ottenere la lista delle direttive del sistema
  */
  _getRuleList()
  {
		let self = this;
		return new Rx.Observable(function(observer)
		{
			let options =
			{
				method: 'GET',
				uri: RULES_SERVICE_URL,
        headers:{'x-api-key': RULES_SERVICE_KEY},
				json: true
			};

			self.request_promise(options).then(function(data)
			{
				observer.complete();
			})
			.catch(function(err)
			{
				observer.error(
				{
					code: err.statusCode,
					msg: err.message
				});
			});
		});
  }

	/**
  * Metodo che permette di rimuovere una direttiva dal sistema
  * @param {String} id - id della direttiva da rimuovere
  */
  _removeRule(id)
  {
		let self = this;
		return new Rx.Observable(function(observer)
		{
			let options =
			{
				method: 'DELETE',
				uri: `${RULES_SERVICE_URL}/${id}`,
        headers:{'x-api-key': RULES_SERVICE_KEY},
				json: true
			};

			self.request_promise(options).then(function(data)
			{
        console.log(data);
				observer.complete();
			})
			.catch(function(err)
			{
        console.log("error ", err)
				observer.error(
				{
					code: err.statusCode,
					msg: err.message
				});
			});
		});
  }

	/**
  * Metodo che permette di aggiornare una direttiva dal sistema
  * @param {Rule} rule - Rule da aggiornare
  */
  _updateRule(rule)
  {
		let self = this;
		return new Rx.Observable(function(observer)
		{
			let options =
			{
				method: 'PUT',
				uri: `${RULES_SERVICE_URL}/${rule.id}`,
        headers:{'x-api-key': RULES_SERVICE_KEY},
				body: rule,
				json: true
			};

			self.request_promise(options).then(function(data)
			{
				observer.complete();
			})
			.catch(function(err)
			{
				observer.error(
				{
					code: err.statusCode,
					msg: err.message
				});
			});
		});
  }
}

module.exports = RuleHandler;
