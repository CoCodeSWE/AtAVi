/*
Diario

 Versione        Programmatore         Data
 ######################################################################
 0.0.1           Mattia Bottaro       2017-04-23

 ----------------------------------------------------------------------
implementata la parte di queryLambda che interagisce con STTWatsonAdapter
 ----------------------------------------------------------------------

*/

const http = require("http");
const rp = require('request-promise');
//var sys = require('sys');
var base64 = require('base-64');
var fs = require('fs');


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

  queryLambda(event, context){
    /* Questo JSON è ciò che api.ai accetta in input. È qui solo per prova
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
*/

    this.stt.speechToText(fs.createReadStream('./hello.wav'),'audio/wav').then(function(res)
      {
      //  options_api_ai.body.query=res; // query api.ai = testo ritornato da STT
        // CONTATTO VirtualAssistant
        /* il codice qui sotto dovrà andare in ApiAiVAAdapter, è qui solo per prova. Notare la request-promise
        rp(options_api_ai).then(function(parsedBody){
          console.log("Q: "+parsedBody.result.resolvedQuery+'\nA: '+parsedBody.result.speech);
          action=parsedBody.result.action;
          text_request=parsedBody.result.resolvedQuery;
          text_response=parsedBody.result.speech;
        }).catch(function(err){
          console.log(err);
        });
        */
      }).catch(err => {console.log("problem")});

    //#########################################

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
  }
  //context.succeed(response);

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

var v = new VocalAPI({},{},{},{},{});
v.queryLambda({},{});

module.exports = VocalAPI;
