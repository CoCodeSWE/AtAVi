// costanti e configurazioni

//TTS
const tts_conf =
{
  lang: 'en-US',
  pitch: 1,
  rate: 1,
  voice: getVoices('en-US')[0],
  volume: 0.5
}

//Recorder
const rec_conf =
{
  // va bene la configurazione di default
}

//URL dell'endpoint
const API_URL = 'http://sime1.ddns.net:3031/test';
// istanziazione classi necessarie al client

let player = new Player(tts_conf, window.speechSynthesis);
let recorder = new Recorder(rec_conf);
let logic = new Logic(API_URL);

player.getObservable().subscribe(
{
  next: (blob) => logic.sendData(/*dati da mandare, compreso audio in base64*/),
  error: (err) => console.log(err)
});

function getVoices(lang)
{
  return window.speechSynthesis.getVoices()
    .filter((voice) => voice.lang === lang);
}
