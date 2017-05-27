/**
* Questa classe si occupa di convertire l'interfaccia fornita da api.ai in una più adatta alle esigenze dell'applicazione, definita da \file{VAModule}.
* \\ Facendo da Adapter tra le API di api.ai (adaptee) e l'interfaccia \file{VAModule} (target) utilizzata da \file{VAService},
* permette l'interoperabilità tra queste due interfacce.
* @author Pier Paolo Tricomi
* @version 0.0.5
* @since 0.0.3-alpha
*/

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
	}

	/**
		* Metodo che permette di interrogare l'Agent in api.ai
		* @param {VAQuery} data - Attributo contenente i dati relativi all'interrogazione
		*/
	query(data)
	{
		if(this.agent === null)
			return Promise.reject({'error': 'Agent not defined'});
    console.log("data: ", JSON.stringify(data, null, 2));
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
    else
    {
      options.body.query = data.text;
    }
		return this.request_promise(options).then(function(response)
		{
			// Creo va_response per mappare la risposta di api.ai in un oggetto VAResponse
      console.log('response api.ai: ', response);
      let action;
      if(response.result.action && !response.result.actionIncomplete)
        action = response.result.action;
      else
        action = '';
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

			if(response.result.contexts && !response.result.actionIncomplete)
				va_response.res.contexts = response.result.contexts;

			if(response.result.fulfillment.data)
			{
        if(response.result.fulfillment.data._status !== 200)
          throw {statusCode: response.result.fulfillment.data.statusCode}
        delete response.result.fulfillment.data._status;  //rimuovo lo stato della risposta settato dal webhook
        va_response.res.data = response.result.fulfillment.data;
      }
      va_response.res.data = Object.assign({}, va_response.res.data, data.data);
			return va_response;
		}); //no catch perchè mi va bene l'eccezione che viene sollevata
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
