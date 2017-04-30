const Rx = require('rxjs/Rx');

class AgentsDAODynamoDB
{
	/**
		* Costruttore della classes
		* @param client {AWS::DynamoDB::DocumentClient} - Modulo di Node.js utilizzato per l'accesso al database DynamoDB contenente la tabella degli agenti
		*/
	constructor(client)
	{
		this.client = client;
		this.table = process.env.AGENTS_TABLE;
	}

	/**
		* Aggiunge un nuovo agente in DynamoDB
		* @param agent {Agent} - Parametro contenente l'agente da aggiungere al database
		*/
	addAgent(agent)
	{
		let self = this;
		return new Rx.Observable(function(observer)
		{
			let params =
			{
				TableName: self.table,
				Item: agent
			};
			self.client.put(params, function(err, data)
			{
				if(err)
					observer.error(err);
				else
					observer.complete();
			});
		});
	}

	/**
		* Ottiene l'agente avente il nome passato come parametro
		* @param name {String} - Parametro contenente il nome dell'agente da ottenere
		*/
	getAgent(name)
	{
		let self = this;
		return new Rx.Observable(function(observer)
		{
			let params =
			{
				TableName: self.table,
				Key:
				{
					'name': name
				}
			};
      console.log(params);
			self.client.get(params, function(err, data)
			{
        console.log(err, data);
				if(err)
					observer.error(err);
				else if(!data.Item.name)
					observer.error('Not found');
				else
				{
					observer.next(data.Item);
					observer.complete();
				}
			});
		});
	}

	/**
		* Ottiene la lista degli agenti in DynamoDB, suddivisi in blocchi (da massimo 1MB)
		*/
	getAgentList()
	{
		let self = this;
		return new Rx.Observable(function(observer)
		{
			let params =
			{
				TableName: self.table
			};
			self.client.scan(params, onScan(observer, self));
		});
	}

	/**
		* Elimina l'agente avente il nome passato come parametro
		* @param name {String} - Parametro contenente il nome dell'agente da rimuovere
		*/
	removeAgent(name)
	{
		let self = this;
		return new Rx.Observable(function(observer)
		{
			let params =
			{
				TableName: self.table,
				Key:
				{
					'name': name
				},
				ConditionExpression: 'attribute_exists(name)'
			};
			self.client.delete(params, function(err, data)
			{
				if(err)
					observer.error(err);
				else
					observer.complete();
			});
		});
	}

	/**
		* Aggiorna un agente passato come parametro (se non c'è lo crea)
		* @param agent {Agent} - Parametro contenente l'agente da aggiornare.
		*/
	updateAgent(agent)
	{
		let self = this;
		return new Rx.Observable(function(observer)
		{
			let params =
			{
				TableName: self.table,
				Item: agent
			};
			self.client.put(params, function(err, data)
			{
				if(err)
					observer.error(err);
				else
					observer.complete();
			});
		});
	}
}

function onScan(observer, agents)
{
	return function(err, data)
	{
		if(err)
			observer.error(err);
		else
		{
			observer.next(data);
			if(data.LastEvaluatedKey)
			{
				let params =
				{
					TableName: agents.table,
					ExclusiveStartKey: data.LastEvaluatedKey
				};
				agents.client.scan(params, onScan(observer, agents));
			}
			else
			{
				observer.complete();
			}
		}
	}
}

module.exports = AgentsDAODynamoDB;
