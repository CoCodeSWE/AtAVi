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
    to_speak.lang = this.options.lang;
    to_speak.pitch = this.options.pitch;
    to_speak.rate = this.options.rate;
    to_speak.voice = this.options.voice;
    to_speak.volume = this.options.volume;
    this.tts.speak(to_speak);
  }
}

module.exports = Player;
