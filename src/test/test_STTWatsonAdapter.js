const STTWatsonAdapter = require('../Back-end/STT/STTWatsonAdapter');

describe('Back-end', function()
{
	describe('STT', function()
	{
		describe('STTWatsonAdapter', function()
		{
			describe('speechToText', function()
			{
				it('Se la chiamata al metodo stt.recognize fallisce allora il metodo deve chiamare il metodo rejected della Promise con un parametro Exception avente campo code 500.');
			});
		});
	});
});
