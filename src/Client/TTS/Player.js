class Player
{
  /**
  * Costruttore del Player che si occupa di riprodurre le risposte dell'assistente.
  * @param conf {TTSConfig} - parametro contenente la configurazione per il Player.
  * @param speech_syntesis {SpeechSynthesis} - parametro contenente uno SpeechSynthesis di JavaScript Web Speech API. Ne effettuiamo qui la dependency injection.
  */
  constructor(conf, speech_syntesis)
  {
    this.tts = speech_syntesis;
    this.options = conf;
    this.subject = new Rx.Subject();
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
  * @param conf {TTSConfig} nuova configurazione del Player.
  */
  setConfig(conf)
  {
    this.options = conf;
  }

  /**
  * Metodo utilizzato per passare al Player il testo da riprodurre.
  * @param text {String} testo da riprodurre.
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
    utterance.onstart = () => this.subject.next(true);
    utterance.onresume = () => this.subject.next(true);
    utterance.onend = () => this.subject.next(false);
    utterance.onpause = () => this.subject.next(false);
    this.tts.speak(to_speak);
  }
}
