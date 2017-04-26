class ApiAiVAAdapter
{
	constructor(agent, rp)
	{
		this.agent = agent;
		this.request_promise = rp;
		this.VERSION = '20150910';
	}
	
	query(str)
	{
		let options =
		{
			method: 'POST',
			uri: `https://api.api.ai/v1/query?v=${this.VERSION}`,
			headers:
			{
				'authorization': this.agent,
				'content-type': 'application/json'
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
}

module.exports = ApiAiVAAdapter;
