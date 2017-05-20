/**
* Questa classe si occupa di registrare i dati relativi alle interazioni degli ospiti col nostro sistema.
* @author Mattia Bottaro
* @version 0.0.6
* @since 0.0.3-alpha
* @todo aggiungere tutti gli encodeURIComponent mancanti
*/

const RULES_SERVICE_URL = process.env.RULES_SERVICE_URL;
const RULES_SERVICE_KEY = process.env.RULES_SERVICE_KEY;
const NOTIFICATIONS_SERVICE_URL = process.env.NOTIFICATIONS_SERVICE_URL;
const NOTIFICATIONS_SERVICE_KEY = process.env.NOTIFICATIONS_SERVICE_KEY;
const DEFAULT_CHANNEL = process.env.DEFAULT_CHANNEL;   //canale di default in cui mandare il messaggio se non so dove mandarlo

class VAMessageListener
{
	constructor(conversations, guests, rp)
	{
		this.conversations = conversations; // ConversationsDAODynamoDB
		this.guests = guests; // GuestssDAODynamoDB
		this.request_promise = rp; // request-promise
	}

	/**
   * Questo metodo si occupa di inviare una notifica alla persona desiderata e di registrare le interzioni avvenute nei relativi databases
	 * @param event {JSON} - parametro contenente il payload del messaggio pubblicato sul topic SNS
	 * @param context {JSON} - parametro per inviare il corpo della risposta. In realtà non viene utilizzato
	 * @param callback {function} - funzione di callback utilizzata per informare il chiamate del successo o del fallimento del metodo
	 */
	onMessage(event, context, callback)
	{
    console.log(JSON.stringify(event, null, 2));
		let self = this;
		let message;
    try
    {
      message  = JSON.parse(event.Records[0].Sns.Message);
    }
    catch(err)
    {
      callback(err);
      return;
    }
		let session_id = message.session_id;
    let params = message.res.contexts ? message.res.contexts[0].parameters : null;
    if(! (params && params.name && params.company))  // se non so ancora il nome o l'azienda dell'ospite, allora non devo notificare sicuramente nessuno di niente.
      callback(null); // successo, non dovevo notificare nessuno e non l'ho fatto.
    let rules_query = '?target.name=' +  encodeURIComponent(params.name) + '&target.company=' + encodeURIComponent(params.company);
    /**
     ** @todo abilitare questi parametri della query quando rules è sistemato
    if(params.required_person)
      rules_query += '&target.member=' + encodeURIComponent(params.required_person);
    */
    // parametri per la richiesta HTTP GET al microservizio Rules
		let rules_options =
		{
			method: 'GET',
			uri: RULES_SERVICE_URL + rules_query,
			json: true,
      headers:{ 'x-api-key': RULES_SERVICE_KEY}
		};
		let msg = {}; // messaggio da inviare alla persona desiderata
    let send_to;
    if(params.request)
    {
      switch(params.request)
      {
        case 'person':
          msg.text = params.name + ' from ' + params.company + ' just arrived and is looking for ' + params.required_person;
          break;
        case 'coffee':
          msg.text = params.name + ' from ' + params.company + ' would like a coffee';
          break;
        case 'drink':
          msg.text = params.name + ' from ' + params.company + ' would like "' + params.drink + '" to drink';
          break;
        case 'general':
          msg.text = params.name + ' from ' + params.company + ' said they need ' + params.need;
          break;
      }
    }
    /*
    if(message.res.contexts[0] && message.res.contexts[0].name === 'guest.warnedRequiredPerson') // notificare la persona desiderata dell'arrivo dell'ospite
			text = message.res.contexts[0].parameters.name + ' from \"' + message.res.contexts[0].parameters.company + '\" is arrived and looking for ' + message.res.contexts[0].parameters.required_person + '.';
		else if(message.action && message.action === 'guest.coffee') // l'ospite vuole un caffè
			text = message.res.contexts[0].parameters.name + ' from \"' + message.res.contexts[0].parameters.company + '\" wants a coffee.';
		else if(message.action && message.action === 'guest.drink') // l'ospite vuole qualcos'altro da bere
			text = message.res.contexts[0].parameters.name + ' from \"' + message.res.contexts[0].parameters.company + '\" wants \"' + message.res.contexts[0].parameters.another_drink + '\"';
		else if(message.action && message.action === 'guest.need') // l'ospite ha bisogno di qualcosa
			text = message.res.contexts[0].parameters.name + ' from \"' + message.res.contexts[0].parameters.company + '\" needs \"' + message.res.contexts[0].parameters.need + '\"';
    */
		if(msg.text) // se text è definito => bisogna notifica qualcuno di qualcosa
		{
			this.request_promise(rules_options).then(function(response)
			{
        /**@todo controllare tutto l'array e non solo il primo elemento, perchè al momento abbiamo solo un
        * tipo di task ma in futuro ce ne potrebbero essere altri
        * */
        console.log('options: ', rules_options);
        console.log('response: ', response);
        if(response.rules && response.rules[0] && response.rules[0].task && response.rules[0].task.task === 'send_to_slack')  // mi dice la direttiva. due volte task perchè una rule contiene TaskInstance
          send_to = Promise.resolve(response.rules[0].task.params);
        else // se non ho una direttiva che mi dica dove mandare il messaggio, devo ricavarmelo io
          send_to = self.request_promise({method: 'GET', uri: NOTIFICATIONS_SERVICE_URL + '/channels?name=' + params.required_person, json: true, headers:{ 'x-api-key': NOTIFICATIONS_SERVICE_KEY}});
        send_to.then((receiver) =>
        {
          let send_to;
          if(!receiver || !receiver[0])
            send_to = DEFAULT_CHANNEL;
          else
            send_to = receiver[0].id;
          console.log('receiver: ', receiver);
          return self.request_promise({method: 'POST', uri: `${NOTIFICATIONS_SERVICE_URL}/channels/${encodeURIComponent(send_to)}`, json: true, body: {msg: msg}, headers:{ 'x-api-key': NOTIFICATIONS_SERVICE_KEY}});
        }).then((data) => {callback();}).catch(callback);  /**@todo veraw gestione errori*/
				/*if(parsed_body.messages[0].task) // notifico la persona desiderata
				{
					if(parsed_body.messages[0].task === 'send_to_slack') // notifico il member della rule
					{
						// Ottengo il canale slack del member
						let notifications_options = // dato il nome del member, ottengo il canale slack grazie alla chiamata HTTP al microservizio Notifications
						{
							method: 'GET',
							uri: NOTIFICATIONS_SERVICE_URL + '?name=' + parsed_body.member,
							json: true
						};
						rp(notifications_options).then(function(parsed_body)
						{
							// parametri per la richiesta HTTP POST al microservizio Notifications
							let notifications_param_member =
							{
								msg:
								{
									attachments_array:[],
									text: text
								},
								send_to: parsed_body.messages[0].id
							};
							let notifications_send_to_slack = // mando il messaggio a slack con la chiamata HTTP al microservizio Notifications
							{
								method: 'POST',
								uri: NOTIFICATIONS_SERVICE_URL,
								body: notifications_param_member,
								json: true
							};
							this.request_promise(notifications_send_to_slack).then().catch(callback);
						}).catch(callback);
					}
					//  Messaggio inviato al member

					//  Ottengo il canale slack della persona desiderata
					let notifications_options = // dato il nome della persona desiderata, ottengo il canale slack grazie alla chiamata HTTP al microservizio Notifications
					{
						method: 'GET',
						uri: NOTIFICATIONS_SERVICE_URL+'?name='+message.res.contexts[0].parameters.required_person,
						json: true
					};
					rp(notifications_options).then(function(parsed_body)
					{
						// notifico la persona desiderata
						let notifications_param_required_person =
						{
							msg:
							{
								attachments_array:[],
								text: text
							},
							send_to: parsed_body.messages[0].id
						};
						let notifications_send_to_slack = // mando il messaggio a slack con la chiamata HTTP al microservizio Notifications
						{
							method: 'POST',
							uri: NOTIFICATIONS_SERVICE_URL,
							body: notifications_param_required_person,
							json: true
						};
						this.request_promise(notifications_send_to_slack).then().catch(callback);
					}).catch(callback);
			  }*/
			}).catch(callback);
		}
    /*
		// MESSAGGIO INVIATO DALL'UTENTE
		let user_conversation_message =
		{
			'text': message.text_request,
			'sender': 'User',
			'timestamp': event.Records[0].Timestamp
		};

		self.conversations.addMessage(user_conversation_message, session_id).subscribe(
			{
				error: callback,
				complete:  () => {callback(null);}
			});

	 	// MESSAGGIO INVIATO DA VA
		let VA_conversation_message =
		{
			'text': event.Records[0].Sns.Message.text_response,
			'sender': 'VirtualAssistant',
			'timestamp': event.Records[0].Timestamp
		};
		self.conversations.addMessage(VA_conversation_message, session_id).subscribe(
			{
				error: callback,
				complete:  () => {callback(null);}
			});
    */
		/*self.guests.addConversation(name, company, session_id).subscribe(
		{
			error: callback,
			complete:  () => {callback(null);}
		});*/

	}

}

module.exports = VAMessageListener;
