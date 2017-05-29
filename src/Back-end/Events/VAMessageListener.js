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
      return;
    }
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
		console.log("RUOLESSS QUERY");
		console.log(rules_query);

		console.log("PARAMSSSSSSSSSSSSS");
		console.log(params);
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
		if(msg.text) // se text è definito => bisogna notifica qualcuno di qualcosa
		{
			this.request_promise(rules_options).then(function(response)
			{
        /**@todo controllare tutto l'array e non solo il primo elemento, perchè al momento abbiamo solo un
        * tipo di task ma in futuro ce ne potrebbero essere altri
        * */
        console.log('options: ', rules_options);
        console.log('response: ', response);
	        if(response.rules && response.rules[0] && response.rules[0].task && response.rules[0].task.type === 'send_to_slack')  // mi dice la direttiva. due volte task perchè una rule contiene TaskInstance
	          send_to = Promise.resolve([{id: response.rules[0].task.params}]);
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
		        }).then((data) => {callback(null);}).catch(callback);  /**@todo vera gestione errori*/
			}).catch(callback);
		}
    else
      callback(null); //non ci sono dati da salvare e non devo notificare nessuno, quindi esco senza errori
	}

  saveConversation(event, context, callback)
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
    this.conversations.addMessage([message.res.text_request, message.res.text_response], session_id).subscribe(
    {
      complete: () => callback(null),
      error: callback
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
    if(params.request)
    {
      let guest = null;
      this.guests.getGuest(params.name, params.company).subscribe(
      {
        next: (data) => {guest = data},
        error: (err) =>
        {
          if(err.code === 404)  //non esiste ancora questo ospite, lo creaimo
            guest = { name: params.name, company: params.company, welcome: { coffee: 0, drink: {}, person: {}, general: null } }
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
