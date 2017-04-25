const Recorder = require('../Client/Recorder/Recorder');
const chai = require('chai');

describe('Client', function()
{
  describe('Recorder', function()
  {
    describe('Recorder', function()
    {
      describe('start and stop', function()
      {
        it('Una volta chiamato il metodo \file{start}, viene inviata una serie di oggetti \file{RecorderMsg} a \file{RecorderWorker} con campo \file{command} uguale a “record” e questa serie di messaggi viene interrotta alla chiamata del metodo \file{stop}.',function()
        {
          recorder = new Recorder({max_listen: 10000, max_silence: -1, threshold: 20});
          recorder.start();


          recorder.stop();
        });
      });
    });
  });
});
