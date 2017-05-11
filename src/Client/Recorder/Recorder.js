/**
* @desc Questa classe si occupa della registrazione della conversazione.
* @author Simeone Pizzi
* @version 0.0.7
* @since 0.0.3-alpha
*/
import Rx from 'rxjs/Rx';

export default class Recorder
{
  /**
  * Costruttore della classe Recorder, inizializza worker e AudioContext.
  * @param {RecorderConfig} conf - configurazione iniziale del Recorder
  */
  constructor(conf)
  {
    // FIXME: rimuovere codice per visualizzazione volume
    //this.element = document.getElementById('volume');
    this.WORKER_PATH = 'js/recorderjs/RecorderWorker.js';

    this.audio_context = new AudioContext();
    this.audio_input = null;
    this.script_node = null;
    this.analiser = null;
    this.subject = new Rx.Subject();
    this.worker = new Worker(conf.worker_path || this.WORKER_PATH);
    this.recording = false;
    this.time = null;
    this.enabled = false;
    this.setConfig(conf);

    let self = this;

    WorkerObservable(this.worker).subscribe(
    {
      next: function(msg)
      {
        switch(msg.type)
        {
          case 'buffers': //mi sono stati mandati i buffer della registrazione
            let audio_buffer = self.audio_context.createBuffer(2, msg.length, self.audio_context.sampleRate);
            audio_buffer.copyToChannel(msg.buffers[0], 0);
            audio_buffer.copyToChannel(msg.buffers[1], 1);
            resample(audio_buffer, self.sample_rate).subscribe(
            {
              next: (data) => {self.worker.postMessage({command: 'encodeWAV', buffer: data.getChannelData(0), mono: true});}, //una volta effettuato il resampling, utilizzo il worker per l'encoding
              error: (err) => {self.subject.error(err);}
            });
            break;
          case 'wav': // mi è arrivato il blob del file wav da mandare
            self.subject.next(msg.blob);
            break;
          default:  //non faccio nulla, messaggio non supportato
        }
      }
    });

    if (!navigator.mediaDevices.getUserMedia) //controllo per i browser più vecchi
    navigator.mediaDevices.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    navigator.mediaDevices.getUserMedia({ audio: true}) // richiedo di poter registrare l'audio
      .then(this._init.bind(this))
      .catch((err) => {self.subject.error(new Error('error getting media device')); console.log(err);});
  }

  /**
  * metodo chiamato quando viene ottenuto lo stream audio, il quale inizializza
  * i vari node
  * @param {MediaStream} stream - stream audio da cui si ottengono i dati
  */
  _init(stream)
  {
    console.log('init');
    let input_point = this.audio_context.createGain();
    let zero_gain = this.audio_context.createGain();

    this.audio_input = this.audio_context.createMediaStreamSource(stream);
    this.audio_input.connect(input_point);
    this.analiser = this.audio_context.createAnalyser();
    this.analiser.fftSize = this.fft;
    input_point.connect(this.analiser);
    zero_gain.gain.value = 0.0;
    input_point.connect(zero_gain);
    zero_gain.connect(this.audio_context.destination);
    this.node = this.audio_context.createScriptProcessor(this.buffer_len, 2, 2);
    this.worker.postMessage({command: 'init', config:{ sampleRate: this.sample_rate}}  );
    this.node.onaudioprocess = this.onAudioProcess.bind(this);
    input_point.connect(this.node);
    this.node.connect(this.audio_context.destination);
  }

  /**
  * metodo che permette di modificare la configurazione del recorder
  * @param {RecorderConfig} conf - parametro contenente la nuova configurazione
  * TODO: forse non dovrebbe settare i valori di default?
  */
  setConfig(conf)
  {
    this.fft = conf.fft || 64;  //rappresenta la dimesione della trasformata di fourier utilizzata per il calcolo del volume
    this.bufferLen = conf.buffer_len || 4096; //lunghezza del buffer audio
    this.threshold = conf.threshold || 15;  //limite del volume minimo
    this.max_silence = conf.max_silence || 2500;  //massimo tempo per cui il volume può stare al di sotto della soglia prima di interrompere la registrazione
    this.sample_rate = conf.sample_rate || 16000; //sample rate dell'audio
  }

  onAudioProcess(msg)
  {
    if(!this.enabled)
    {
      console.log('disabled');  //FIXME
      return;
    }
    let self = this;
    let vol_data = new Uint8Array(this.analiser.fftSize);
    this.analiser.getByteFrequencyData(vol_data); //ottengo i dati della frequenza, necessari per calcolare il volume
    //console.log(vol_data);
    let level = vol_data.reduce((acc, val) => {return acc + val}, 0) / vol_data.length;  // calcolo il volume medio
    //this.element.innerHTML = level; //FIXME eliminare debug volume
    if(level > this.threshold)
    {
      if(this.time)
      {
        clearTimeout(this.time);
        this.time = null;
      }
      if(!this.recording)
      this._startRecording();
    }
    else if(this.max_silence !== -1 && !this.time  && level <= this.threshold)
    {
      this.time = setTimeout(() => {self._stopRecording(); }, self.max_silence);
    }
    if(this.recording)
      this.worker.postMessage({command: 'record', buffer: [ msg.inputBuffer.getChannelData(0), msg.inputBuffer.getChannelData(1)]});
  }

  start()
  {
    console.log(new Error());
    this.enabled = true;
    this._startRecording();
  }

  enable()
  {
    console.log(new Error());
    this.enabled = true;
  }

  stop()
  {
    this.enabled = false;
    this._stopRecording();
  }

  _startRecording()
  {
    console.log('recording', this.recording);
    if(!this.recording)
    {
      this.worker.postMessage({command: 'clear'});
      this.recording = true;
    }
  }

  _stopRecording()
  {
    console.log('notRecording', this.recording);
    if(this.recording)
    {
      this.recording = false;
      clearTimeout(this.time);
      this.time = null;
      this.worker.postMessage({command: 'getBuffers'});
    }
  }

  getObservable()
  {
    return this.subject.asObservable();
  }
}

function WorkerObservable(worker)
{
  return new Rx.Observable(function(observer)
  {
    worker.onmessage = (msg) => observer.next(msg.data);
  });
}

function resample(audio_buffer, target_sr)
{
  return new Rx.Observable(function(observer)
  {
    console.log('resample', audio_buffer, target_sr, audio_buffer.sampleRate);
    var ch = audio_buffer.numberOfChannels; //numero dei canali
    var frames = audio_buffer.length * target_sr / audio_buffer.sampleRate;
    console.log(ch, frames, target_sr);
    var offline_context = new OfflineAudioContext(ch, frames, target_sr);
    var buffer_source = offline_context.createBufferSource();
    buffer_source.buffer = audio_buffer;
    offline_context.oncomplete = function(event)
    {
      console.log('Done Rendering');
      observer.next(event.renderedBuffer);
      console.log(event.renderedBuffer);
      observer.complete();
    }
    console.log('Starting Offline Rendering');
    buffer_source.connect(offline_context.destination);
    buffer_source.start(0);
    offline_context.startRendering();
  });
}
