const http = require("http");
const rp = require('request-promise');
//var sys = require('sys');
//var base64_decode = require('base64').decode;
var fs = require('fs');
var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');


class VocalAPI
{
  constructor(vocal, jwt, rp, stt, sns)
  {
    this.vocal = vocal;
    this.request_promise = rp;
    this.sns = sns;
    this.stt = stt;
    this.jwt = jwt;
  }

  static queryLambda(event, context){
    //let body=JSON.parse(event.body);

    // CONTATTO IBM WATSON

/* audio -> Base64 è fatto nel client
    var buf = new Buffer('./hello4.wav');

    sys.print(base64_encode(buf));

    sys.print(base64_decode('hello_audio'));
*/
/*
    ########## QUESTE COSE DEVONO ESSERE FATTE DA STTMODULE E VIRTUALASSISTANT #############

    let action, text_request, text_response;
    let options_api_ai = {
      method: 'POST',
      uri: 'https://api.api.ai/v1/query',
      headers: {
        'Content-Type':'application/json; charset=utf-8',
        'Host':'api.api.ai',
        'X-Amz-Date':'20170419T123358Z',
        'Authorization':'Bearer 8e48b54bd55d4d68a68371a870558470'
      },
      body: {
        query: [
            '' // verrà stabilità da STT IBM
        ],
        timezone: 'Europe/Rome',
        lang: 'en',
        sessionId: '1234567890'
      },
      json: true
    }

    let speech_to_text = new SpeechToTextV1({
      username: '637a5774-9755-4b80-b134-af716927bc9d',
      password: 'QfOX3P4ZlndK'
    });

    let params = {
      audio: fs.createReadStream('./hello.wav'),
      content_type: 'audio/wav'
    };


    speech_to_text.recognize(params, function(err, res) {
      if (err)
        console.log(err);
      else
      {
        options_api_ai.body.query=res.results[0].alternatives[0].transcript; // query api.ai = testo ritornato da STT
        // CONTATTO API.AI
        rp(options_api_ai).then(function(parsedBody){
          //console.log("Q: "+parsedBody.result.resolvedQuery+'\nA: '+parsedBody.result.speech);
          action=parsedBody.result.action;
          text_request=parsedBody.result.resolvedQuery;
          text_response=parsedBody.result.speech;
        }).catch(function(err){
          console.log(err);
        });
      }
    });
    #########################################
*/

    switch(action){
      case 'rule.add':
        this._addRule();
        break;
      case 'rule.get':
        this._getRule();
        break;
      case 'rule.getList':
        this._getRuleList();
        break;
      case 'rule.remove':
        this._removeRule();
        break;
      case 'rule.update':
        this._updateRule();
        break;
      case 'user.add':
        this._addUser();
        break;
      case 'user.addEnrollment':
        this._addUserEnrollment();
        break;
      case 'user.get':
        this._getUser();
        break;
      case 'user.getList':
        this._getUserList();
        break;
      case 'user.login':
        this._loginUser();
        break;
      case 'user.remove':
        this._removeUser();
        break;
      case 'user.resetEnrollment':
        this._resetUserEnrollment();
        break;
      case 'user.update':
        this._updateUser();
        break;
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify({
          "action":action,
          "res":{
              "contexts":['nisba',"two"],
              "data":{
                  "token":"TOKEN"
              },
              "text_request": text_request,
              "text_response":text_response
          },
          "session_id":"123"
      }),
    };
  }

  context.succeed(response);

  /******* RULE *********/

  _addRule(rule){
  }

  _getRule(id){ // id è una stringa

  }
  _getRuleList(){

  }

  _removeRule(id){

  }

  _updateRule(rule){

  }

  /******* USER *********/

  _addUser(user){
  }

  _addUserEnrollment(enr){

  }

  _getUser(username){

  }

  _getUserList(){

  }

  _loginUser(enr){

  }

  _removeUser(username){

  }

  _resetUserEnrollment(username){

  }

  _updateUser(user){

  }

}

VocalAPI.queryLambda();

module.exports = VocalAPI;
