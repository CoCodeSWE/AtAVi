/**
*	Questa classe si occupa di convertire l'interfaccia fornita dal servizio di Speech to Text di IBM in una più adatta alle esigenze dell'applicazione,
* definita da \file{STTModule}. \\ Facendo da Adapter tra le API del servizio di Speech to Text di IBM (adaptee) e
* l'interfaccia \file{STTModule} (target) utilizzata da \file{APIGateway::VocalAPI}, permette l'interoperabilità tra queste due interfacce.
* @author Pier Paolo Tricomi
* @version 0.0.6
* @since 0.0.3-alpha
*/

const http = require("http");
const Promise = require('bluebird');
//var fs = require('fs');
//var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');


class STTWatsonAdapter
{
	constructor(sb, stt, model)
	{
		this.streamifier = sb;
		this.stt = stt;
    this.model = model;
	}

	/** metodo che contatta il servizio esterno STT di ibm e ritorna una promessa soddisfatta con il testo pronunciato nell'audio
	* @param audio {Buffer} - Parametro contenente l'audio dal quale estrarre il testo pronunciato
	* @param type {String} - indica in quale formato è l'audio
	*/

	speechToText(audio, type)
	{
		var self = this;
    let params = {
      audio: this.streamifier.createReadStream(audio),
      content_type: type
    };
    if(this.model)
      params.customization_id = this.model;
		return new Promise(function(fulfill, reject)
		{
			self.stt.recognize(params, function(err, res)
			{
        console.log('data: ', res);
				if (err)
					reject(err);
        else if(!(res.results && res.results[0]))
          fulfill('');
        else
					fulfill(res.results[0].alternatives[0].transcript);
			});
		});
	 }
}

module.exports = STTWatsonAdapter;

/* // TEST
var s = new STTWatsonAdapter({},new SpeechToTextV1({
	username: '',
	password: ''
}));
var p = s.speechToText({},'audio/wav');
p.then(console.log);
*/

