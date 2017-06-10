const Rx = require('rxjs/Rx');
const CmdRunner = require('./CmdRunner');
const RULES_SERVICE_KEY = process.env.RULES_SERVICE_KEY;
const RULES_SERVICE_URL = process.env.RULES_SERVICE_URL;
const NOTIFICATIONS_SERVICE_KEY = process.env.NOTIFICATIONS_SERVICE_KEY;
const NOTIFICATIONS_SERVICE_URL = process.env.NOTIFICATIONS_SERVICE_URL;
const DEFAULT_CHANNEL = process.env.NOTIFICATIONS_DEFAULT_CHANNEL;

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
			let query = { event:{}, data: response.data ? response.data : {}};
			console.log(response);
			if(!response || !response.res)
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
							params.target_name = params.target_name.toLowerCase();
							params.target_member = params.target_member.toLowerCase();
							params.target_company = params.target_company.toLowerCase();
							let id_slack;
							query.event = { name: 'addRuleSuccess', data: { username: params.username } };
							console.log("rule.add");
							this._getChannelList(params.username_slack).subscribe(
							{
								next: (data) =>
								{
									console.log("next _getChannelList",data);
									if(data.length === 0)
										id_slack = DEFAULT_CHANNEL;
									else
										id_slack = data[0].id;
								},

								error: (err) =>
								{
									console.log("error _getChannelList",err);
									query.event.name = "error500";
									resolve(query);
								},

								complete: () =>
								{
									console.log("complete _getChannelList");
									this._addRule(
									{
										name: params.rule_name,
										task:
										{
											'params': id_slack,
											'type': params.task_name
										},
										targets:[
										{
											name: params.target_name,
											member: params.target_member,
											company: params.target_company
										}],
										enabled: true,
										override: false
									}).subscribe(
									{
										complete: () =>
										{
											resolve(query);
										},
										error: (err) =>
										{
											console.log("error _addRule IN _getChannelList",err);
											query.event.name = "error409_rule";
											query.event.data = { username: params.username, rule_name: params.rule_name };
											resolve(query);
										}
									});
								}
							});
						}
						else
							reject(WRONG_APP);
						break;
					case 'rule.getList':
						if(body.app === 'admin')
						{
							let rules;
							query.event = { name: 'getRuleListSuccess' };
							this._getRuleList().subscribe(
							{
								next: (data) => { rules = data },
								error: reject,
								complete: () =>
								{
									query.event.data = { rules: JSON.stringify(rules, null, 2) };
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
							query.event = {name: 'getSuccess'};
							this._getRule(params.rule_name).subscribe(
							{
								next: (data) => { rule = JSON.stringify(data, null, 2); },
								error: (err) =>
								{
									query.event.name = "error404";
									query.event.data = { username: params.username };
									resolve(query);
								},
								complete: () =>
								{
									query.event.data = { rule: rule, username: params.username };
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
							query.event = {name: 'removeRuleSuccess', data: { username: params.username } };
							this._removeRule(params.rule_name).subscribe(
							{
								complete: () =>
								{
									resolve(query);
								},
								error: (err) =>
								{
									query.event.name = "error404";
									resolve(query);
								}
							});
						}
						else
							reject(WRONG_APP);
						break;
					case 'rule.update':
						if(body.app === 'admin')
						{
							let rule, id_slack;
							query.event = {name: 'updateRuleSuccess', data: { username: params.username }};
							this._getChannelList(params.username_slack).subscribe(
							{
								next: (data) =>
								{
									if(data.length === 0)
										id_slack = DEFAULT_CHANNEL;
									else
										id_slack = data[0].id;
								},

								error: (err) =>
								{
									query.event.name = "error500";
									resolve(query);
								},

								complete: () =>
								{		
									this._getRule(params.rule_name).subscribe(
									{
										next: (data) =>
										{
											rule = data;
											rule.task =
											{
												'params': id_slack,
												'type': params.rule_task
											};
											rule.enabled = Boolean(params.rule_isEnabled.toUpperCase() === 'TRUE');
										},
								
										error: (err) =>
										{
											query.event.name = "error404";
											query.event.data = { username: params.username };
											resolve(query);
										},
								
										complete: () =>
										{
											this._updateRule(rule).subscribe(
											{
												complete: () =>
												{
													resolve(query);
												},
												error: (err) =>
												{
													query.event.name = "error500";
													query.event.data = { username: params.username };
													resolve(query);
												}
											});
										}
									});
								}
							});
						}
						else
							reject(WRONG_APP);
						break;
					case 'rule.updateTarget':
						if(body.app === 'admin')
						{
							params.name = params.name.toLowerCase();
							params.member = params.member.toLowerCase();
							params.company = params.company.toLowerCase();
							let rule;
							query.event = {name: 'updateRuleTargetSuccess', data: { username: params.username }};
							this._getRule(params.rule_name).subscribe(
							{
								next: (data) =>
								{
									rule = data;
									rule.targets = [{ name: params.name, company: params.company, member: params.member }];
								},
					
								error: (err) =>
								{
									query.event.name = "error404";
									query.event.data = { username: params.username };
									resolve(query);
								},
					
								complete: () =>
								{
									this._updateRule(rule).subscribe(
									{
										complete: () =>
										{
											resolve(query);
										},
										
										error: (err) =>
										{
											query.event.name = "error500";
											query.event.data = { username: params.username };
											resolve(query);
										}
									});
								}
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
	* @param {String} name - nome della direttiva richiesta
	*/
	_getRule(name)
	{
		let self = this;
		return new Rx.Observable(function(observer)
		{
			let options =
			{
				method: 'GET',
				uri: `${RULES_SERVICE_URL}/${name}`,
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
	* Metodo che permette di rimuovere una direttiva dal sistema
	* @param {String} name - nome della direttiva da rimuovere
	*/
	_removeRule(name)
	{
		let self = this;
		return new Rx.Observable(function(observer)
		{
			let options =
			{
				method: 'DELETE',
				uri: `${RULES_SERVICE_URL}/${name}`,
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
			console.log(rule);
			let options =
			{
				method: 'PUT',
				uri: `${RULES_SERVICE_URL}/${rule.name}`,
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

	_getChannelList(username)
	{
		let self = this;
		return new Rx.Observable(function(observer)
		{
			let options =
			{
				method: 'GET',
				uri: `${NOTIFICATIONS_SERVICE_URL}/channels?username=${username}`,
				headers:{'x-api-key': NOTIFICATIONS_SERVICE_KEY},
				json: true
			};

			console.log(options);
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
}

module.exports = RuleHandler;
