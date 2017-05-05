class ApiAiVAAdapter
{
	/**
		* Costruttore della classe
		* @param {RequestPromiseModule} rp - Modulo per poter fare richieste HTTP ai microservizi
		* @param {Agent} agent - contiene l'Agent interrogato. Può essere null
		*/
	constructor(rp, agent)
	{
    /**
    * @type {string}
    */
		this.agent = agent;
    /**
    * @type {RequestPromiseModule}
    */
		this.request_promise = rp;
    /** @constant {string} */
    this.VERSION = '20150910';
    this.LANG = 'en';
    this.DEF_ACTION = 'admin.displayMsgs'
	}

	/**
		* Metodo che permette di interrogare l'Agent in api.ai
		* @param {VAQuery} data - Attributo contenente i dati relativi all'interrogazione
		*/
	query(data)
	{
		if(this.agent === null)
			return Promise.reject({'error': 'Agent not defined'});

		let options =
		{
			method: 'POST',
			uri: `https://api.api.ai/v1/query?v=${this.VERSION}`,
			headers:
			{
				'Authorization': "Bearer " + this.agent.token,
				'Content-Type': 'application/json; charset=utf-8'
			},
			body:
      {
        sessionId: data.session_id,
        originalRequest:
        {
          source: "AtAVi",
          data: data.data
        },
        lang: this.LANG
      },
			json: true
		};
    if(data.event)
    {
      options.body.event = data.event;
    }
    else if(data.text)
    {
      options.body.query = data.text;
    }
		return this.request_promise(options).then(function(response)
		{
			// Creo va_response per mappare la risposta di api.ai in un oggetto VAResponse
      let action;
      if(response.result.action && !response.result.actionIncomplete)
        action = response.result.action;
      else
        action = this.DEF_ACTION;
      let va_response =
			{
				action: action,
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

	/**
		* Metodo setter di agent
		* @param {Agent} agent - Nuovo agent
		*/
	setAgent(agent)
	{
		this.agent = agent;
	}
}

module.exports = ApiAiVAAdapter;
