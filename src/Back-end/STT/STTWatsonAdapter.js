/*

Diario

 Versione        Programmatore         Data
 ######################################################################
 0.0.1           Mattia Bottaro       2017-04-23

 ----------------------------------------------------------------------
implementata la classe
 ----------------------------------------------------------------------

*/
const http = require("http");
var promise = require('bluebird');
//var fs = require('fs');
//var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');


class STTWatsonAdapter
{
	constructor(sb, stt)
	{
		this.stream_buffer = sb;
		this.stt = stt;

	}

	/** metodo che contatta il servizio esterno STT di ibm e ritorna una promessa soddisfatta con il testo pronunciato nell'audio
	* @param audio {Buffer} - Parametro contenente l'audio dal quale estrarre il testo pronunciato
	* @param type {String} - indica in quale formato è l'audio
	*/

	speechToText(audio, type)
	{
		var self = this;
    let params = {
      audio: audio,
      content_type: type
    };
		return new Promise(function(fulfill, reject)
			{
				self.stt.recognize(params, function(err, res)
					{
		      	if (err)
		    				reject(err);
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
