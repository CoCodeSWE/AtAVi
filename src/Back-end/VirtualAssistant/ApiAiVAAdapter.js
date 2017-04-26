class ApiAiVAAdapter
{
	constructor(rp, agent)
	{
		this.agent = agent;
		this.request_promise = rp;
		this.VERSION = '20150910';
	}
	
	query(str)
	{
		if(this.agent === null)
			return Promise.reject({'error': 'Agent not defined'});
		
		let options =
		{
			method: 'POST',
			uri: `https://api.api.ai/v1/query?v=${this.VERSION}`,
			headers:
			{
				'Authorization': this.agent.token,
				'Content-Type': 'application/json'
			},
			body: str,
			json: true
		};
		
		return this.request_promise(options).then(function(response)
		{
			// Creo va_response per mappare la risposta di api.ai in un oggetto VAResponse
			let va_response =
			{
				action: response.result.action,
				res:
				{
					text_request: response.result.resolvedQuery,
					text_response: response.result.fulfillment.speech
				},
				session_id: response.sessionId
			};
			
			if(response.result.contexts)
				va_response.res.contexts = response.result.contexts;
			
			if(response.result.fulfillment.data)
				va_response.res.data = response.result.fulfillment.data;
			
			return va_response;
		});
	}
	
	setAgent(agent)
	{
		this.agent = agent;
	}
}

module.exports = ApiAiVAAdapter;
