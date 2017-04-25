const Rx = require('rxjs/Rx')

class Player
{
  constructor(conf, speech_syntesis)
  {
    this.tts = speech_syntesis;
    this.options = conf;
    this.subject = new Rx.Subject();
  }
  
  cancel()
  {
    tts.cancel();
  }

  getObservable()
  {
    return tts.subject.asObservable();
  }

  getVoices()
  {
    return tts.getVoices();
  }

  isPlaying()
  {
    return tts.speaking;
  }

  pause()
  {
    tts.pause();
  }

  resume()
  {
    tts.resume();
  }

  setConfig(conf)
  {
    this.options = conf;
  }

  speak(text)
  {
    var toSpeak = new SpeechSynthesisUtterance(text);
    toSpeak.lang = options.lang;
    toSpeak.pitch = options.pitch;
    toSpeak.rate = options.rate;
    toSpeak.voice = options.voice;
    toSpeak.volume = options.volume;
    tts.speak(toSpeak);
  }
}

module.exports = Player;
