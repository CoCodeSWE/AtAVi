//sarebbero tutti require, quelli che dobbiamo fare noi li lascio oggetti vuoti


'use strict';

const sns = require('aws-sdk').SNS;

let VAMessageListener = new VAMessageListener(conversations, guests, rp);

module.exports.onMessage = function(event, context, callback)
{
  VAMessageListener.onMessage(event, context, callback);
}
