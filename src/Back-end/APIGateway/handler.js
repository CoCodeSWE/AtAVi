//sarebbero tutti require, quelli che dobbiamo fare noi li lascio oggetti vuoti

/*
INPUT SCHEMA
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "title": "VARequestAPIBody",
  "type": "object",
  "properties":{
    "app":{"type":"string"},
    "audio":{"type":"string"},
    "data":{
        "type":"array",
        "items":{
            "type":"string"
        }
    },
    "session_id":{"type":"string"}
  }
}

OUTPUT schema
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "title": "VAResponse",
  "type": "object",
  "properties":{
    "action":{"type":"string"},
    "res":{
        "type":"object",
        "properties":{
            "contexts":{"type":"array"},
            "data":{"type":"object"},
            "text_request":{"type":"string"},
            "text_response":{"type":"string"}
        }
    },
    "session_id":{"type":"string"}
  }
}
*/

'use strict';

//const sns = require('aws-sdk').SNS;
const sns = {};
const stt = {};
const vocal = {};
//const rp = require('request-promise');
const rp = {};
const jwt = require('json-web-token');
const VocalAPI = require('./VocalAPI');

let gateway = new VocalAPI(vocal, jwt, rp, stt, sns);

// module.exports.query = gateway.queryLambda.bind(gateway);

///* ALTERNATIVA SENZA BIND
module.exports.queryLambda = function(event, context)
{
  gateway.queryLambda(event, context);

  /*const response = {
    statusCode: 200,
    body: JSON.stringify({
        "action":"ACT",
        "res":{
            "contexts":["one","two"],
            "data":{
                "token":"TOKEN"
            },
            "text_request":"question",
            "text_response":"answer"
        },
        "session_id":"123"
    }),
  };*/
}

// E' EQUIVALENTE*/
