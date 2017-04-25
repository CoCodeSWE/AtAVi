/*

Diario

 Versione        Programmatore         Data
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
	}

	onMessage(event, context, callback)
	{
		let message = event.Records[0].Sns.Message;
		let session_id = event.Records[0].Sns.session_id;
		let rules_for_guest = // guestsDAO.query(target, send_to_slack);

		// parametri per la richiesta HTTP GET al microservizio Rules
		// come ottengo la Rules sapendo il target? Tra l'altro è bene che il target sia in event
		// forse ci vuole un nuovo endpoint
		let rules_param =
		{

		};
		rp(rules_param).then(function(parsed_body)
		{
			// parametri per la richiesta HTTP POST al microservizio Notifications
			// if(direttiva === send_to_slack)
			let notifications_param =
			{
				'msg':
				{
					'attachments_array':[],
					'text': // ci vuole un modo per capire che testo inviare alla persona desiderata
				},
				'send_to': // event.Records[0].Sns.Message.res.data.something...
			};
			rp(notifications_param).then(function(parsed_body){}).catch(function(err){});
		}).catch(function(err){});

		// MESSAGGIO INVIATO DALL'UTENTE
		let user_conversation_message =
		{
			'text': event.Records[0].Sns.Message.text_response,
			'sender': , // dovrebbe essere presente in event, forse all'interno di event.MessageAttributes.
			'timestamp': event.Records[0].Timestamp;
		};
		conversations.addMessage(user_conversation_message, session_id);

	 	// MESSAGGIO INVIATO DA VA
		let user_conversation_message =
		{
			'text': event.Records[0].Sns.Message.text_response,
			'sender': 'VirtualAssistant',
			'timestamp': event.Records[0].Timestamp
		};
		conversations.addMessage(user_conversation_message, session_id);
		// talking_guest.conversations += session_id;
		// guests.updateGuest(talking_guest)
	}

}

module.exports = VAMessageListener;
