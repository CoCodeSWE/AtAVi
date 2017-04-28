//sarebbero tutti require, quelli che dobbiamo fare noi li lascio oggetti vuoti
const SNS = require('aws-sdk').SNS;
const VocalLoginMicrosoftModule = require('VocalLoginMicrosoftModule');
const STTWatsonAdapter = require('STTWatsonAdapter');
const rp = require('request-promise');
const jwt = require('jsonwebtoken');
const VocalAPI = require('./VocalAPI');
const sb = require('stream-buffer');
const SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');

//configurazioni
//STT
const STT_CONF =
{
  username: process.env.WATSON_USERNAME,
  password: process.env.WATSON_PASSWORD
}
//VocalLoginMicorsoftModule
const VOCAL_LOGIN_CONF =
{
  key: process.env.MICROSOFT_SPEAKER_RECOGNITION_KEY,
  min_confidence: 2
}

//creazione moduli per dependency injection
let sns = new SNS({ sns: '2010-03-31' });
let stt = new STTWatsonAdapter(sb, new STTWatsonAdapter(STT_CONF));
let vocal = new VocalLoginMicrosoftModule(VOCAL_LOGIN_CONF);

let gateway = new VocalAPI(vocal, jwt, rp, stt, sns);

module.exports.query = gateway.query.bind(gateway);
