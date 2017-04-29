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
    this.tts.cancel();
  }

  getObservable()
  {
    return this.tts.subject.asObservable();
  }

  getVoices()
  {
    return this.tts.getVoices();
  }

  isPlaying()
  {
    return this.tts.speaking;
  }

  pause()
  {
    this.tts.pause();
  }

  resume()
  {
    this.tts.resume();
  }

  setConfig(conf)
  {
    this.options = conf;
  }

  //metodo che passa al player il testo che deve essere riprodotto
  speak(text)
  {
    let to_speak = new SpeechSynthesisUtterance(text);
    //imposto le configurazione del oggetto da riprodurre
    to_speak.lang = this.options.lang;
    to_speak.pitch = this.options.pitch;
    to_speak.rate = this.options.rate;
    to_speak.voice = this.options.voice;
    to_speak.volume = this.options.volume;

    this.tts.speak(to_speak);
  }
}
