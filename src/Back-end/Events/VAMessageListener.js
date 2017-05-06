/**
* Questa classe si occupa di registrare i dati relativi alle interazioni degli ospiti col nostro sistema.
* @author Mattia Bottaro
* @version 0.0.6
* @since 0.0.3-alpha
*/
class VAMessageListener
{
	constructor(conversations, guests, rp)
	{
		this.conversations = conversations; // ConversationsDAODynamoDB
		this.guests = guests; // GuestssDAODynamoDB
		this.request_promise = rp; // request-promise
		this.RULES_SERVICE_URL = process.env.RULES_SERVICE_URL;
    this.NOTIFICATIONS_SERVICE_URL = process.env.NOTIFICATIONS_SERVICE_URL;
	}

	/**
   * Questo metodo si occupa di inviare una notifica alla persona desiderata e di registrare le interzioni avvenute nei relativi databases
	 * @param event {JSON} - parametro contenente il payload del messaggio pubblicato sul topic SNS
	 * @param context {JSON} - parametro per inviare il corpo della risposta. In realtà non viene utilizzato
	 * @param callback {function} - funzione di callback utilizzata per informare il chiamate del successo o del fallimento del metodo
	 */

	onMessage(event, context, callback)
	{
		let self = this;
		let message = event.Records[0].Sns.Message;
		let session_id = event.Records[0].Sns.session_id;
		let rules_param = // 0.0.2 - 1
		// parametri per la richiesta HTTP GET al microservizio Rules
		// come ottengo la Rules sapendo il target? Tra l'altro è bene che il target sia in event
		// forse ci vuole un nuovo endpoint ... Ci vuole un nuovo endpoint
		{

		};
		let rules_options =
		{
			method: 'GET',
			uri: self.RULES_SERVICE_URL,
			body: rules_param,
			json: true
		};
		let text = ''; // testo da inviare alla persona desiderata
		if(message.action && message.action === 'guest.warnedRequiredPerson') // notificare la persona desiderata dell'arrivo dell'ospite
			text = message.res.contexts[0].parameters.name + ' from \"' + message.res.contexts[0].parameters.company + '\" is arrived and looking for ' + message.res.contexts[0].parameters.required_person + '.';
		else if(message.action && message.action === 'guest.coffee') // l'ospite vuole un caffè
			text = message.res.contexts[0].parameters.name + ' from \"' + message.res.contexts[0].parameters.company + '\" wants a coffee.';
		else if(message.action && message.action === 'guest.drink') // l'ospite vuole qualcos'altro da bere
			text = message.res.contexts[0].parameters.name + ' from \"' + message.res.contexts[0].parameters.company + '\" wants \"' + message.res.contexts[0].parameters.another_drink + '\"';
		else if(message.action && message.action === 'guest.need') // l'ospite ha bisogno di qualcosa
			text = message.res.contexts[0].parameters.name + ' from \"' + message.res.contexts[0].parameters.company + '\" needs \"' + message.res.contexts[0].parameters.need + '\"';

		if(text) // se text è non vuoto => bisogna notifica qualcuno di qualcosa
		{
			rp(rules_options).then(function(parsed_body) // occhio che quando esisteranno più tipi di task, parsed_body potrebbe contenere un vettore
			{
				if(parsed_body.messages[0].task) // notifico la persona desiderata
				{
					if(parsed_body.messages[0].task === 'send_to_slack') // notifico il member della rule
					{
						// #################### Ottengo il canale slack del member ########################
						let notifications_options = // dato il nome del member, ottengo il canale slack grazie alla chiamata HTTP al microservizio Notifications
						{
							method: 'GET',
							uri: self.NOTIFICATIONS_SERVICE_URL+'?name='+parsed_body.member,
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
								uri: self.NOTIFICATIONS_SERVICE_URL,
								body: notifications_param_member,
								json: true
							};
							rp(notifications_send_to_slack).then().catch(callback);
						}).catch(callback);
					}
					// ##################### Messaggio inviato al member ######################################

					// #################### Ottengo il canale slack della persona desiderata ########################
					let notifications_options = // dato il nome della persona desiderata, ottengo il canale slack grazie alla chiamata HTTP al microservizio Notifications
					{
						method: 'GET',
						uri: self.NOTIFICATIONS_SERVICE_URL+'?name='+message.res.contexts[0].parameters.required_person,
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
							uri: self.NOTIFICATIONS_SERVICE_URL,
							body: notifications_param_required_person,
							json: true
						};
						rp(notifications_send_to_slack).then().catch(callback);
					}).catch(callback);
			  }
			}).catch(callback);
		}

		// MESSAGGIO INVIATO DALL'UTENTE
		let user_conversation_message =
		{
			'text': event.Records[0].Sns.Message.text_request,
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

		/*self.guests.addConversation(name, company, session_id).subscribe(
		{
			error: callback,
			complete:  () => {callback(null);}
		});*/

	}

}

module.exports = VAMessageListener;
