import Rx from 'rxjs/Rx';

export default class Player
{
  /**
  * Costruttore del Player che si occupa di riprodurre le risposte dell'assistente.
  * @param {TTSConfig} conf - parametro contenente la configurazione per il Player.
  * @param {SpeechSynthesis} speech_syntesis - parametro contenente uno SpeechSynthesis di JavaScript Web Speech API. Ne effettuiamo qui la dependency injection.
  */
  constructor(conf, speech_syntesis)
  {
    this.tts = speech_syntesis;
    this.options = conf;
    this.subject = new Rx.Subject();
    this._time = null;
  }

  /**
  * Metodo utilizzato per rimuovere tutte le utterance dalla coda.
  */
  cancel()
  {
    this.tts.cancel();
  }

  /**
  * Metodo utilizzato per ritornare l'Observable relativo all'attributo subject.
  */
  getObservable()
  {
    return this.subject.asObservable();
  }

  /**
  * Metodo utilizzato per ottenere tutte le voci disponibili per il Player.
  * @return {SpeechSynthesisVoice[]} lista di tutte le voci disponibili.
  */
  getVoices()
  {
    return this.tts.getVoices();
  }

  /**
  * Metodo utilizzato per capire lo stato del Player.
  * @return {boolean} true se il Player sta riproducendo dell'audio o è in pausa, false altrimenti.
  */
  isPlaying()
  {
    return this.tts.speaking;
  }

  /**
  * Metodo utilizzato per pausare il Player.
  */
  pause()
  {
    this.tts.pause();
  }

  /**
  * Metodo utilizzato per riprendere la riproduzione dell'audio.
  */
  resume()
  {
    this.tts.resume();
  }

  /**
  * Metodo utilizzato per cambiare la configurazione del Player.
  * @param {TTSConfig} conf nuova configurazione del Player.
  */
  setConfig(conf)
  {
    this.options = conf;
  }

  /**
  * Metodo utilizzato per passare al Player il testo da riprodurre.
  * @param {String} text testo da riprodurre.
  */
  speak(text)
  {
    let utterance = new SpeechSynthesisUtterance(text);
    //imposto le configurazione del oggetto da riprodurre
    utterance.lang = this.options.lang;
    utterance.pitch = this.options.pitch;
    utterance.rate = this.options.rate;
    utterance.voice = this.options.voice;
    utterance.volume = this.options.volume;
    utterance.onstart = () => {console.log('startSpeak');this.subject.next(true)};
    utterance.onresume = () => {console.log('resumeSpeak');this.subject.next(true)};
    utterance.onend = () => {console.log('end');this.subject.next(false)};
    utterance.onpause = () => {console.log('pause');this.subject.next(false)};
    utterance.onerror = () => {console.log('error');this.subject.next(false)};
    //utterance.onboundary = () => {console.log('boundary')};
    this.tts.speak(utterance);
    //fix callback non chiamati
    if(this._time)
      clearTimeout(this._time);
    this.time = setTimeout(() => {console.log(utterance)}, 60000);  //settando il timeout
    // in teoria non viene chiamato il garbage collector su utterance, e quindi
    // i callback vengono chiamati
  }
}
