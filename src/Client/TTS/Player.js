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

  //metodo che passa al player il testo che deve essere pronunciato
  speak(text)
  {
    var to_speak = new SpeechSynthesisUtterance(text);
    to_speak.lang = options.lang;
    to_speak.pitch = options.pitch;
    to_speak.rate = options.rate;
    to_speak.voice = options.voice;
    to_speak.volume = options.volume;
    tts.speak(to_speak);
  }
}

module.exports = Player;
