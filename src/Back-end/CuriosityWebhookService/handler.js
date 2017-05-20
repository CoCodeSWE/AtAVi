'use strict';

module.exports.webhook = (event, context) => {
    let body;
    let curiosity_from_db={text:"testolello", type:"sporto"};

  context.succeed(
          {
    "speech":curiosity_from_db.text,
    "displayText":curiosity_from_db.type,
    "source": "nope",
    "data":{},
    "contextOut":[],
    "followupEvent": {
    	"name": "sportCuriosityEvent",
    	"data":{
    		"text":"deer?",
    		"type":"sport"
    	}
    	},
    "timezone": "Europe/Rome",
    "lang": "en",
    "sessionId": "1234567890"
});
};
