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
var fs = require('fs');
//var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');


class STTWatsonAdapter
{
	constructor(sb, stt)
	{
		this.stream_buffer = sb;
		/*this.stt = new SpeechToTextV1({username: '21ba336f-8d8f-468d-a37d-3ffe3be29dae',
		password: 'sYORNvBXg7en'});*/
	}

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
						//console.log(pro);
		    	});
			});
	 }
}

module.exports = STTWatsonAdapter;

/* // TEST
var s = new STTWatsonAdapter({},new SpeechToTextV1({
	username: '21ba336f-8d8f-468d-a37d-3ffe3be29dae',
	password: 'sYORNvBXg7en'
}));
var p = s.speechToText({},'audio/wav');
p.then(console.log);
*/
