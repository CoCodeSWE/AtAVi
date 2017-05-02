/*

Diario

 Versione        Programmatore         Data
 ######################################################################
 0.0.2           Mattia Bottaro       2017-04-29

 ----------------------------------------------------------------------
 1 - Ancora non riesco a definire i parametri per fare una riciesta HTTP al microservizio rules.
 		 Serve un endpoint che, dato il target, ne ritorni le direttive.
		 Questo endpoint ancora non è stato definito.
 2 - Non ho modo di definire il valore di notifications_param.send_to. Servirebbe il MembersDAOSlack
 		 per ottenere il canale slack della persona desiderata (e in caso quello generale).

 ----------------------------------------------------------------------

 ######################################################################
 0.0.1           Mattia Bottaro       2017-04-25

 ----------------------------------------------------------------------
Codificati gran parte dei comportamenti che il metodo onMessage deve assumere.
Mancano da capire le seguenti cose:
	1 -	Da che paramentri capisco chi è l'ospite con il quale interagisco? In event non
	 		c'è nulla del genere. R: Forse in event o data.
	2 - Dato il target, come ottengo la relativa Rules? Avrei bisogno di RulesDAO
			o di un nuovo endpoint. R : Endpoint
	3 - come si stabilisce che testo inviare alla persona desiderata? Bisognerebbe capire
			le intenzioni dell'ospite ...
	4 - farebbe comodo un metodo guests.addConversation
 ----------------------------------------------------------------------

*/

class VAMessageListener
{
	constructor(conversations, guests, rp)
	{
		this.conversations = conversations;
		this.guests = guests;
		this.request_promise = rp;
		this.RULES_SERVICE_URL = process.env.RULES_SERVICE_URL;
    this.NOTIFICATIONS_SERVICE_URL = process.env.NOTIFICATIONS_SERVICE_URL;
	}

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

		rp(rules_options).then(function(parsed_body) // occhio che quando esisteranno più tipi di task, parsed_body potrebbe contenere un vettore
		{
			// parametri per la richiesta HTTP POST al microservizio Notifications
			// if(direttiva === send_to_slack)
			if(parsed_body.task === 'notifications_slack') // nome improvvisato, NON da considerare reale.
			{
				if(message.action === 'guest.warnedRequiredPerson') // notificare la persona desiderata dell'arrivo dell'ospite
					text = message.res.contexts[0].parameters.name + ' from ' + message.res.contexts[0].parameters.company + ' is looking for ' + message.res.contexts[0].parameters.required_person + '.';
				else if(message.action === 'guest.coffee') // l'ospite vuole un caffè
					text = message.res.contexts[0].parameters.name + ' from ' + message.res.contexts[0].parameters.company + ' wants a coffee.';
				else if(message.action === 'guest.drink') // l'ospite vuole qualcos'altro da bere
					text = message.res.contexts[0].parameters.name + ' from ' + message.res.contexts[0].parameters.company + ' wants \"' + message.res.contexts[0].parameters.another_drink + '\"';
				else if(message.action === 'guest.need') // l'ospite ha bisogno di qualcosa
					text = message.res.contexts[0].parameters.name + ' from ' + message.res.contexts[0].parameters.company + ' needs \"' + message.res.contexts[0].parameters.another_drink + '\"';

				let notifications_param =
				{
					msg:
					{
						attachments_array:[],
						text: text
					},
					send_to: // event.Records[0].Sns.Message.res.data.something... ci vuole il canale slack! 0.0.2 - 2
				};
				let notifications_options =
				{
					method: 'POST',
					uri: self.NOTIFICATIONS_SERVICE_URL,
					body: notifications_param
					json: true
				};
				rp(notifications_options).then(function(parsed_body){}).catch(callback);
		  }
		}).catch(callback);

		// MESSAGGIO INVIATO DALL'UTENTE
		let user_conversation_message =
		{
			'text': event.Records[0].Sns.Message.text_request,
			'sender': , // dovrebbe essere presente in event, forse all'interno di event.MessageAttributes.
			'timestamp': event.Records[0].Timestamp
		};
		self.conversations.addMessage(user_conversation_message, session_id).subscribe(
			{
				next:  (data) => {},
				error: (err) =>
				{
					callback(
						{
							statusCode: err.statusCode,
							body: JSON.stringify(err.message)
						});
				},
				complete:  () => {}
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
				next:  (data) => {},
				error: (err) =>
				{
					callback(
						{
							statusCode: err.statusCode,
							body: JSON.stringify(err.message)
						});
				},
				complete:  () => {}
			});
/*
		self.guests.addConversation(name, company, session_id).subscribe(
			{
				next:  (data) => {},
				error: (err) =>
				{
					callback(
						{
							statusCode: err.statusCode,
							body: JSON.stringify(err.message)
						});
				},
				complete:  () => {}
			});
*/
	}

}

module.exports = VAMessageListener;
