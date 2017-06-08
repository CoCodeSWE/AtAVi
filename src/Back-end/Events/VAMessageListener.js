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
	notify(event, context, callback)
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
    let params = message.res.contexts && message.res.contexts[0] ? message.res.contexts[0].parameters : null;
    console.log(params);
    console.log(!params || !params.name || !params.company)
    if(!(params && params.name && params.company))  // se non so ancora il nome o l'azienda dell'ospite, allora non devo notificare sicuramente nessuno di niente.
    {
      callback(null); // successo, non dovevo notificare nessuno e non l'ho fatto.

		let name_required_person = params.required_person.toLowerCase();
		let guest_name = params.name.toLowerCase();
		let company_name = params.company.toLowerCase();
    let rules_query = '?target.name=' +  encodeURIComponent(guest_name) + '&target.company=' + encodeURIComponent(company_name);
    /**
     ** @todo abilitare questi parametri della query quando rules è sistemato
    if(params.required_person)
      rules_query += '&target.member=' + encodeURIComponent(params.required_person);
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
				case 'auto_solicitous':
					msg.text = 'I\'m trying to entertain ' + params.name + ' as much as possible, but I\'m running out of ideas. Please, come here!';
					break;
				case 'solicitous_from_guest':
					msg.text = params.name + ' is tired of waiting. Please, come here!';
					break;
			}
    }
		if(msg.text) // se text è definito => bisogna notifica qualcuno di qualcosa
		{
			this.request_promise(rules_options).then(function(response)
			{
				/**ciclo che conta quante rules permettono l'override.
				se una rule con priorità j lo permette ma una con priorità i > j no, questa non viene considerata**/
				let rule_to_apply = 0;
				while (rule_to_apply < response.rules.length && response.rules[rule_to_apply].override === true) {
					rule_to_apply++;
				}

				for(let i = 0; i <= rule_to_apply; ++i)
				{
					if(response.rules && response.rules[i] && response.rules[i].task && response.rules[i].type === 'send_to_slack')  // mi dice la direttiva. due volte task perchè una rule contiene TaskInstance
						send_to = Promise.resolve([{id: response.rules[i].task.params}]);
	        else // se non ho una direttiva che mi dica dove mandare il messaggio, devo ricavarmelo io
	          send_to = self.request_promise({method: 'GET', uri: NOTIFICATIONS_SERVICE_URL + '/channels?name=' + params.required_person, json: true, headers:{ 'x-api-key': NOTIFICATIONS_SERVICE_KEY}});
		        send_to.then((receiver) =>
		        {
		          let send_to;
		          if(!receiver || !receiver[0])
		            send_to = DEFAULT_CHANNEL;
		          else
		            send_to = receiver[0].id;
		          return self.request_promise({method: 'POST', uri: `${NOTIFICATIONS_SERVICE_URL}/channels/${encodeURIComponent(send_to)}`, json: true, body: {msg: msg}, headers:{ 'x-api-key': NOTIFICATIONS_SERVICE_KEY}});
		        }).then((data) => {callback(null);}).catch(callback);  /**@todo vera gestione errori*/
				}
			}).catch(callback);
		}
    else
      callback(null); //non ci sono dati da salvare e non devo notificare nessuno, quindi esco senza errori
	}

  saveConversation(event, context, callback)
  {
    console.log("event saveConv", JSON.stringify(event, null, 2));
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
		console.log("message params",message);

    let params = message.res.contexts ? message.res.contexts[0].parameters : null;
    if(! (params && params.name && params.company && params.required_person && (params.confirm_required_person === 'true' || !params.confirm_required_person)))  // se non so ancora il nome o l'azienda dell'ospite, allora non devo notificare sicuramente nessuno di niente.
		{
      callback(null); // successo, non dovevo notificare nessuno e non l'ho fatto.
			return;
		}

		let name_required_person = params.required_person.toLowerCase();
		let guest_name = params.name.toLowerCase();
		let company_name = params.company.toLowerCase();
		console.log(name_required_person);
		// => tutto in minuscolo e senza spazi (es: Mario Rossi => mariorossi).

    self.conversations.addMessages([message.res.text_request, message.res.text_response], session_id).subscribe(
    {
      complete: () => callback(null),
      error: (err) =>
      {
			  if(err.message === "The provided expression refers to an attribute that does not exist in the item")
			  { // abbiamo tentato di aggiungere un messaggio ad una conversazione non esistente
				console.log("abbiamo tentato di aggiungere un messaggio ad una conversazione non esistente. In questo punto dovremmo anche registrare l'ospite");
				self.guests.addGuest({"guest_name": guest_name, "company": company_name}).subscribe(
					{
						complete: () => // se l'aggiunta ha avuto successo => era la prima registrazione dell'ospite
						{
							console.log("complete addguest save conv");
							let met = {};
							let guest = {"guest_name": guest_name, "company": company_name, "met": met, "food": 0, "technology": 0, "sport": 0, "general": 0};
							guest.met[name_required_person] = 1;
							self.guests.updateGuest(guest).subscribe(
								{
									error: (err) =>
									{
										console.log("error update guest complete",err);
									}
								});
						},
						error: (err) => // se l'aggiunta ha avuto un errore => vuol dire che il guest è già stato registrato
						{
							console.log("addguest error", err);
							if(err.code === "ConditionalCheckFailedException")
							{
								self.guests.getGuest(guest_name, company_name).subscribe(
								{
									next: (item) =>
									{
										console.log("in condition error")
										if(name_required_person && !item.met[name_required_person])
										{
											item.met[name_required_person] = 1;
											console.log("name req && !array",item);
											self.guests.updateGuest(item).subscribe(
												{
													error: (err) =>
													{
													 console.log("err update guest error",err);
												 	}
												});
										}
										else if(name_required_person)
										{
											item.met[name_required_person]++;
											console.log("name req",item);
											self.guests.updateGuest(item).subscribe({err: console.log});
										}
									}
								});
							}
						}
					});
				self.conversations.addConversation({"guest_name":guest_name,"company":company_name,"session_id": session_id, "messages":[]}).subscribe({err: console.log});
			  }
			  else
					callback();
	  }
    });
   }

  updateGuest(event, context, callback)
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

		let name_required_person = params.required_person.toLowerCase();
		let guest_name = params.name.toLowerCase();
		let company_name = params.company.toLowerCase();
    if(params.request)
    {
      let guest = null;
      this.guests.getGuest(guest_name, company_name).subscribe(
      {
        next: (data) => {guest = data},
        error: (err) =>
        {
          if(err.code === 404)  //non esiste ancora questo ospite, lo creaimo
            guest = { name: guest_name, company: company_name, welcome: { coffee: 0, drink: {}, person: {}, general: null } }
        }
      })
      if(!guest)
        callback('errore');
      else
      {
        switch(params.request)
        {
          case 'person':
            if(guest.welcome.person[params.required_person])  // se ha già incontrato questa persona, incrementiamo il numero di incontri
              guest.welcome.person[params.required_person]++;
            else  // altrimenti salviamo il primo incontro
              guest.welcome.person[params.required_person] = 1;
            break;
          case 'coffee':
            guest.welcome.coffee++;
            break;
          case 'drink':
          if(guest.welcome.drink[params.drink])  // se ha già incontrato questa persona, incrementiamo il numero di incontri
            guest.welcome.drink[params.drink]++;
          else  // altrimenti salviamo il primo incontro
            guest.welcome.drink[params.drink] = 1;
          break;
          case 'general':
            guest.welcome.general = params.need;
        }
        this.guests.updateGuest(guest).subscribe(
        {
          complete: () => callback(null),
          error: callback
        });
      }
    }
    else
      callback(null); // nessuna richiesta, non dobbiamo aggiornare nulla
  }
}

module.exports = VAMessageListener;
