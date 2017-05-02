const Rx = require('rxjs/Rx');

class VocalLoginMicrosoftModule
{
	/**
	 * Costruttore della classe
	 * @param conf {VocalLoginModuleConfig} - Parametro contenente la configurazione di VocalLoginModule. Contiene una key e un livello minimo di confidenza
	 * @param rp {RequestPromiseModule} - Modulo per poter fare richieste HTTP ai microservizi
	 */
	constructor(conf, rp)
	{
		this.key = conf.key;
		this.min_confidence = conf.min_confidence;
		this.request_promise = rp;
	}

	/**
		*	Verification Profile - Create Enrollment (https://westus.dev.cognitive.microsoft.com/docs/services/563309b6778daf02acc0a508/operations/56406930e597ed20c8d8549c)
		* @param id {String} - Stringa contenente l'identificativo dell'utente a cui si vuole aggiungere un enrollment
		* @param audio {Blob} - Blob contenente il file audio dell'enrollment
		*/
	addEnrollment(id, audio)
	{
		let self = this;
		return new Rx.Observable(function(observer)
		{
			let options =
			{
				method: 'POST',
				uri: `https://westus.api.cognitive.microsoft.com/spid/v1.0/verificationProfiles/${id}/enroll`,
				headers:
				{
					'Ocp-Apim-Subscription-Key': self.key	// Credenziali per accedere al servizio
				},
				body: audio,
				json: true // Automaticamente passa un JSON come risposta (non serve fare JSON.parse)
			};
			
			self.request_promise(options).then(function()
			{
				observer.complete();
			})
			.catch(function(err)
			{
				observer.error(err);
			});
		});
	}

	/**
		* Verification Profile - Create Profile (https://westus.dev.cognitive.microsoft.com/docs/services/563309b6778daf02acc0a508/operations/563309b7778daf06340c9652)
		*/
	createUser()
	{
		let self = this;
		return new Rx.Observable(function(observer)
		{
			let options =
			{
				method: 'POST',
				uri: 'https://westus.api.cognitive.microsoft.com/spid/v1.0/verificationProfiles',
				headers:
				{
					'Ocp-Apim-Subscription-Key': self.key	// Credenziali per accedere al servizio
				},
				body:
				{
					'locale': 'en-us',	// Località della lingua del nuovo utente
				},
				json: true
			};

			self.request_promise(options).then(function(data)
			{
				observer.next(data);
				observer.complete();
			})
			.catch(function(err)
			{
				observer.error(err);
			});
		});
	}

	/**
		* Verification Profile - Delete Profile (https://westus.dev.cognitive.microsoft.com/docs/services/563309b6778daf02acc0a508/operations/563309b7778daf06340c9655)
		* @param id {String} - Parametro contenente l'identificativo dell'utente che si vuole eliminare
		*/
	deleteUser(id)
	{
		let self = this;
		return new Rx.Observable(function(observer)
		{
			let options =
			{
				method: 'DELETE',
				uri: `https://westus.api.cognitive.microsoft.com/spid/v1.0/verificationProfiles/${id}`,
				headers:
				{
					'Ocp-Apim-Subscription-Key': self.key	// Credenziali per accedere al servizio
				},
				json: true
			};

			self.request_promise(options).then(function()
			{
				observer.complete();
			})
			.catch(function(err)
			{
				observer.error(err);
			});
		});
	}

	/**
		* Speaker Recognition - Verification (https://westus.dev.cognitive.microsoft.com/docs/services/563309b6778daf02acc0a508/operations/56406930e597ed20c8d8549d)
		* @param id {String} - Parametro contenente l'identificativo dell'utente che vuole effettuare il login
		* @param audio {Blob} - Parametro contenente l'audio relativo alla frase di riconoscimento pronunciata
		*/
	doLogin(id, audio)
	{
		let self = this;
		return new Rx.Observable(function(observer)
		{
			let options =
			{
				method: 'GET',
				uri: `https://westus.api.cognitive.microsoft.com/spid/v1.0/verify?verificationProfileId=${id}`,
				headers:
				{
					'Ocp-Apim-Subscription-Key': self.key	// Credenziali per accedere al servizio
				},
				body: audio,
				json: true
			};

			self.request_promise(options).then(function(data)
			{
				if(data.result === 'Accept' && mapConfidence(data.confidence) >= mapConfidence(this.min_confidence))
					observer.complete();
				else
					observer.error('Error recognizing user');
			})
			.catch(function(err)
			{
				observer.error(err);
			});
		});
	}

	/**
		* Verification Profile - Get All Profiles (https://westus.dev.cognitive.microsoft.com/docs/services/563309b6778daf02acc0a508/operations/563309b7778daf06340c9653)
		*/
	getList()
	{
		let self = this;
		return new Rx.Observable(function(observer)
		{
			let options =
			{
				method: 'GET',
				uri: 'https://westus.api.cognitive.microsoft.com/spid/v1.0/verificationProfiles',
				headers:
				{
					'Ocp-Apim-Subscription-Key': self.key	// Credenziali per accedere al servizio
				},
				json: true
			};

			self.request_promise(options).then(function(data)
			{
				observer.next(data);
				observer.complete();
			})
			.catch(function(err)
			{
				observer.error(err);
			});
		});
	}

	/** 
		* Verification Profile - Get Profile (https://westus.dev.cognitive.microsoft.com/docs/services/563309b6778daf02acc0a508/operations/56409ee2778daf19706420de)
		* @param id {String} - Stringa contenente l'identificativo dell'utente di cui si vogliono ottenere le informazioni
		*/
	getUser(id)
	{
		let self = this;
		return new Rx.Observable(function(observer)
		{
			let options =
			{
				method: 'GET',
				uri: `https://westus.api.cognitive.microsoft.com/spid/v1.0/verificationProfiles/${id}`,
				headers:
				{
					'Ocp-Apim-Subscription-Key': self.key	// Credenziali per accedere al servizio
				},
				json: true
			};

			self.request_promise(options).then(function(data)
			{
				observer.next(data);
				observer.complete();
			})
			.catch(function(err)
			{
				observer.error(err);
			});
		});
	}

	/**
		* Verification Profile - Reset Enrollments (https://westus.dev.cognitive.microsoft.com/docs/services/563309b6778daf02acc0a508/operations/56406930e597ed20c8d8549b)
		* @param id {String} - Parametro contenente l'identificativo dell'utente di cui si vogliono eliminare gli enrollment
		*/
	resetEnrollment(id)
	{
		let self = this;
		return new Rx.Observable(function(observer)
		{
			let options =
			{
				method: 'POST',
				uri: `https://westus.api.cognitive.microsoft.com/spid/v1.0/verificationProfiles/${id}/reset`,
				headers:
				{
					'Ocp-Apim-Subscription-Key': self.key	// Credenziali per accedere al servizio
				},
				json: true
			};

			self.request_promise(options).then(function()
			{
				observer.complete();
			})
			.catch(function(err)
			{
				observer.error(err);
			});
		});
	}
}

/**
	* Assegna un valore numerico alla confidenza passata alla funzione. Ritorna -1 se l'input è un valore di confidence non atteso.
	* @param confidence {String} - Valore che indica il livello di confidenza. È un valore che può assumere i seguenti valori:
		- 0: Low
		- 1: Normal
		- 2: High
*/

function mapConfidence(confidence)
{
	let value; // Contiene il valore di ritorno della funzione

	switch(confidence)
	{
		case 'Low':
			value = 0;
			break;
		case 'Normal':
			value = 1;
			break;
		case 'High':
			value = 2;
			break;
		default:
			value = -1;
			break;
	}

	return value;
}

module.exports = VocalLoginMicrosoftModule;
