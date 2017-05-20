'use strict';

module.exports.webhook = (event, context) =>
{
  let curiosity_from_db={text:"testolello", type:"sporto"};
  let body =
  {
    "speech":curiosity_from_db.text,
    "displayText":curiosity_from_db.type,
    "source": "nope",
    "data":{},
    "contextOut":[],
    "followupEvent":
    {
    	"name": "sportCuriosityEvent",
    	"data":
      {
    		"text":"deer?",
    		"type":"sport"
    	}
  	},
    "timezone": "Europe/Rome",
    "lang": "en",
    "sessionId": "1234567890"
  };
  context.succeed({statusCode: 200, body: JSON.stringify(body)});
};
