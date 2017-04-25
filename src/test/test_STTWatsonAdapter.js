const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const STTWatsonAdapter = require('../Back-end/STT/STTWatsonAdapter');
const STT = require('./stubs/STT');
const streamBuffers = require('./stubs/StreamBuffers');

describe('Back-end', function()
{
	describe('STT', function()
	{
		describe('STTWatsonAdapter', function()
		{
			let watson = new STTWatsonAdapter(streamBuffers, STT);
			describe('speechToText', function()
			{
				it('Se la chiamata al metodo stt.recognize fallisce allora il metodo deve chiamare il metodo rejected della Promise con un parametro onRejected avente campo code 500.', function()
				{
					let onRejected = sinon.stub();
					let promise = watson.speechToText();
					promise.catch(onRejected);
					expect(onRejected.callCount).to.equal(1);
					let call = onRejected.getCall(0);
					expect(call.args[0]).to.deep.equal({code: 500});
				});
			});
		});
	});
});
