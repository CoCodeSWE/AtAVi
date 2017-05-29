/**
* Classe che si occupa di implementare l'interfaccia \file{AgentsDAO}, utilizzando un database DynamoDB come supporto per la memorizzazione dei dati.
* @author Luca Bertolini
* @version 0.0.5
* @since 0.0.3-alpha
*/
const Rx = require('rxjs/Rx');
const mapProperties = require('map-object-properties');

class AgentsDAODynamoDB
{
	/**
		* Costruttore della classe
		* @param {AWS.DynamoDB.DocumentClient} client - Modulo di Node.js utilizzato per l'accesso al database DynamoDB contenente la tabella degli agenti
		*/
	constructor(client)
	{
		this.client = client;
		this.table = process.env.AGENTS_TABLE;
	}

	/**
		* Aggiunge un nuovo agente in DynamoDB
		* @param {Agent} agent - Parametro contenente l'agente da aggiungere al database
		*/
	addAgent(agent)
	{
		let self = this;
		return new Rx.Observable(function(observer)
		{
			let params =
			{
				TableName: self.table,
				Item: mapProperties(agent, attr_map),
				ConditionExpression: 'attribute_not_exists(agent_name)'
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
		* @param {String} name - Parametro contenente il nome dell'agente da ottenere
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
					'agent_name': name
				}
			};
			self.client.get(params, function(err, data)
			{
				if(err){
					console.log("errore obs");
					console.log(err);
					observer.error(err);
				}
				else if(!data.Item)
					observer.error({ code: 'Not found'});
				else
				{
					observer.next(mapProperties(data.Item, reverse_attr_map));
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
			self.client.scan(params, self._onScan(observer, params));
		});
	}

	/**
		* Elimina l'agente avente il nome passato come parametro
		* @param {String} name - Parametro contenente il nome dell'agente da rimuovere
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
					'agent_name': name
				},
				ConditionExpression: 'attribute_exists(agent_name)'
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
		* @param {Agent} agent - Parametro contenente l'agente da aggiornare.
		*/
	updateAgent(agent)
	{
		let self = this;
		return new Rx.Observable(function(observer)
		{
			let params =
			{
				TableName: self.table,
				Item: mapProperties(agent, attr_map)
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
		* Viene ritornata la funzione di callback per la gesitone dei blocchi di getAgentList
		* @param observer {AgentObserver} - Observer da notificare
		* @param params {Object} - Parametro passato alla funzione scan del DocumentClient
		*/
	_onScan(observer, params)
	{
		let self = this;
    return function(err, data)
		{
      if(err)
			{
				observer.error(err);
			}
			else
			{
        data.Items.forEach((agent) => observer.next(mapProperties(agent, reverse_attr_map)));
				if(data.LastEvaluatedKey)
				{
					params.ExclusiveStartKey = data.LastEvaluatedKey;
					self.client.scan(params, self._onScan(observer, params));
				}
				else
				{
					observer.complete();
				}
			}
		}
	}
}

const attr_map =
{
  name: 'agent_name'
}

const reverse_attr_map =
{
  full_name: 'name'
}

module.exports = AgentsDAODynamoDB;
