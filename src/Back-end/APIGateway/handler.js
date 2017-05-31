// sarebbero tutti require, quelli che dobbiamo fare noi li lascio oggetti vuoti
const SNS = require('aws-sdk').SNS;
const VocalLoginMicrosoftModule = require('./MockLogin');//require('VocalLoginMicrosoftModule');
const STTWatsonAdapter = require('./STTWatsonAdapter');
const rp = require('request-promise');
const jwt = require('jsonwebtoken');
const VocalAPI = require('./VocalAPI');
const sb = require('streamifier');
const SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
const UserHandler = require('./UserHandler');
const RuleHandler = require('./RuleHandler');
const AppSwitchHandler = require('./AppSwitchHandler');
const NotifyHandler = require('./NotifyHandler');
const SlackAPI = require('./slack.js');
const SPEAKER_RECOGNITION_KEY = process.env.SPEAKER_RECOGNITION_KEY;

// configurazioni
// STT
const STT_CONF =
{
  username: process.env.WATSON_USERNAME,
  password: process.env.WATSON_PASSWORD
}
// VocalLoginMicorsoftModule
const VOCAL_LOGIN_CONF =
{
  key: SPEAKER_RECOGNITION_KEY,
  min_confidence: 1
}

// creazione moduli per dependency injection
let sns = new SNS({ sns: '2010-03-31' });
let stt = new STTWatsonAdapter(sb, new SpeechToTextV1(STT_CONF), '99720d30-3b15-11e7-b5ec-0bae065a439e');
let vocal = new VocalLoginMicrosoftModule(VOCAL_LOGIN_CONF, rp);
let runner = new RuleHandler(new UserHandler(new AppSwitchHandler(new NotifyHandler(null, sns)), jwt, rp, vocal), rp);  // costruisco la catena che gestisce la action supportate dal backend
let gateway = new VocalAPI(vocal, jwt, rp, stt, sns, runner);
let bot = new SlackAPI();

module.exports.query = gateway.queryLambda.bind(gateway);
module.exports.queryText = gateway.queryText.bind(gateway);
module.exports.bot = bot.post.bind(bot);
