//import e require
import Recorder from './Recorder/Recorder'
import Player from './TTS/Player';
import Logic from './Logic/Logic';
import ApplicationLocalRegistry from './ApplicationManager/ApplicationLocalRegistry';
import ApplicationRegistryLocalClient from './ApplicationManager/ApplicationRegistryLocalClient';
import {ConversationApp} from './Applications/ConversationApp';
import blobToBase64 from './Utility/blobToBase64';
import Manager from './ApplicationManager/Manager';
const uuidV4 = require('uuid/v4');
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
  worker_path: 'Script/RecorderWorker.js',
  threshold: 15  //FIXME rimettere ad un valore decente o utilizzare il default
}

//URL dell'endpoint
const API_URL = 'http://localhost:3031/'; /**@todo cambiare url mettendo quello vero*/

// istanziazione classi necessarie al client e inizializzazione variabili
/** @todo forse da mettere tutto in window.onload*/
let recorder = new Recorder(rec_conf);
let player = new Player(tts_conf, window.speechSynthesis);
let logic = new Logic(API_URL);
// application manager e dipendenze
let registry = new ApplicationLocalRegistry();
let reg_client = new ApplicationRegistryLocalClient(registry);
reg_client.register('conversation', ConversationApp).subscribe({error: console.log});
reg_client.register('administration', ConversationApp).subscribe({error: console.log});  //registro l'applicazione di conversazione sia per la conversazione sia per l'amministrazione
                                                         //visto che hanno l'interfaccia condivisa
let application_manager = new Manager(reg_client, document.getElementById('mainFrame'));

var session_id = uuidV4();
console.log('session_id: ', session_id);

player.getObservable().subscribe(
{
  next: function(playing)
  {
    console.log('Player next', playing);
    if(playing)
      recorder.stop();
    else
      recorder.enable();
  },
  error: console.log,  /** @todo implementare un vero modo di gestire gli errori */
  complete: console.log
});

recorder.getObservable().subscribe(
{
  next: function(blob)
  {
    console.log('Recorder next');
    let app = application_manager.application_name;
    blobToBase64(blob)
      .then(function(audio)
      {
        let query =
        {
          app: app,
          audio: audio,
          data: {}, /**@todo passare davvero i dati*/
          session_id: session_id
        }
        logic.sendData(query);
      })
      .catch(console.log)
  },
  error: console.log,  /** @todo implementare un vero modo di gestire gli errori */
  complete: console.log
});

logic.getObservable().subscribe(
{
  next: function(response)
  {
    console.log('logic next');
    let action = response.action.split('.');
    let app = action[0];
    let cmd = action[1];
    console.log(action, app, cmd);
    application_manager.runApplication(app, cmd, response.res);
    player.speak(response.res.text_response);
  },
  error: console.log,  /** @todo implementare un vero modo di gestire gli errori */
  complete: console.log
});


//recorder.start(); /**@todo rimuovere e collegarlo ai tasti*/

document.getElementById('start').onclick = recorder.start.bind(recorder);

/**
 * getVoices - funzione che permette di ottenere la lista delle voci disponibili
 * per la sintesi vocale in una certa lingua.
 *
 * @param  {String} lang la lingua della quale si vuole ottenere l'elenco delle
 * voci disponibili
 * @return {SpeechSynthesisVoiceArray} lista delle voci disponibili per la lingua
 * indicata
 */
function getVoices(lang)
{
  return window.speechSynthesis.getVoices()
    .filter((voice) => voice.lang === lang);
}