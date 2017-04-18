//sarebbero tutti require, quelli che dobbiamo fare noi li lascio oggetti vuoti
const sns = require('aws-sdk').SNS;
const stt = {};
const vocal = {};
const rp = require('request-pronise');
const jwt = require('')
const VocalAPI = require('./VocalAPI');

let gateway = new VocalAPI(vocal, jwt, rp, stt, sns);

module.exports.query = gateway.query.bind(gateway);

/* ALTERNATIVA SENZA BIND
module.exports.query = function(event, context)
{
  gateway.query(event, context);
}

E' EQUIVALENTE*/
