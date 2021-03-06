//import e require
import Recorder from './Recorder/Recorder'
import Player from './TTS/Player';
import Logic from './Logic/Logic';
import ApplicationLocalRegistry from './ApplicationManager/ApplicationLocalRegistry';
import ApplicationRegistryLocalClient from './ApplicationManager/ApplicationRegistryLocalClient';
import {ConversationApp} from './Applications/ConversationApp';
import {AdministrationApp} from './Applications/AdministrationApp';
import blobToBase64 from './Utility/blobToBase64';
import Manager from './ApplicationManager/Manager';
import EventObservable from './Utility/EventObservable';
const uuidV4 = require('uuid/v4');
// costanti e configurazioni

//TTS
const tts_conf =
{
  lang: 'en-US',
  pitch: 1,
  rate: 1,
  voice: getVoices('en-US')[0],
  volume: 1
}

//Recorder
const rec_conf =
{
  worker_path: 'Script/RecorderWorker.js',
  threshold: 20,
  disable_on_data: true,
  max_silence: 700
}

//URL degli endpoint
const VOCAL_URL = 'https://tv7xyk6f3j.execute-api.eu-central-1.amazonaws.com/dev/vocal-assistant';
const TEXT_URL = 'https://tv7xyk6f3j.execute-api.eu-central-1.amazonaws.com/dev/text-assistant';

// istanziazione classi necessarie al client e inizializzazione variabili

let data = {};
let recorder = new Recorder(rec_conf);
let player = new Player(tts_conf, window.speechSynthesis);
let logic = new Logic();
// application manager e dipendenze
let registry = new ApplicationLocalRegistry();
let reg_client = new ApplicationRegistryLocalClient(registry);
let subscriptions = []; // subscriptions alle observable
let patt_soll = new RegExp("Do you like sport?"); // stringa da confrontare con la domanda dell'assistente per abilitare pulsante sollecito
let patt_shutdown = new RegExp("helpful");
let time = null; // timeout per fare lo shutdown dopo un certo lasso di tempo
let start_time = null; // timeout per abilitare il bottone del sollecito la prima volta
let finish_time = null; //timeout per spegnere Atavi finita la conversazione
let max_silence_time = 90000;
let start_reminder_button = 20000;
let time_shutdown = 15000;
let buttonKey = document.getElementById("buttonKeyboard");
let buttonRem = document.getElementById("buttonReminder");

reg_client.register('conversation', ConversationApp).subscribe({error: console.log});
reg_client.register('admin', AdministrationApp).subscribe({error: console.log}); //registro l'applicazione di conversazione sia per la conversazione sia per l'amministrazione
reg_client.register('curiosity', AdministrationApp).subscribe({error: console.log});
                                                                             //visto che hanno l'interfaccia condivisa
let application_manager = new Manager(reg_client, document.getElementById('mainFrame'));
let sendObservable = new EventObservable('submit', 'textMsg'); // questo è il form del quale aspetto il submit in modalità testo
let enabled = false;
let keyboard = false;
var session_id = uuidV4();
console.log('session_id: ', session_id);

// Observable per i click
let startObservable = new EventObservable('click', 'start');
let keyboardObservable = new EventObservable('click', 'buttonKeyboard');
let reminderObservable = new EventObservable('click', 'buttonReminder');

// iscrizione a observable per i click
startObservable.subscribe(function()
{
  if(enabled)
  {
    clearTimeout(time);
    hideButtonReminder(buttonRem);
    recorder.stop();
    if(player.isPlaying())
      player.cancel();
    application_manager.resetState();
    application_manager.runApplication("conversation", "clear", {})
    session_id = uuidV4();
    if (keyboard)
    {
      disableKeyboard();
      keyboard = false;
    }
    disableButtonKeyboard(buttonKey); //disabilita pulsante per inserimento tramite tastiera
  }
  else
  {
    recorder.enable();
    enableButtonKeyboard(buttonKey); //abilita pulsante per inserimento tramite tastiera
    vocalInit();
  }
  enabled = !enabled;
  changeValueButton();
});

keyboardObservable.subscribe(function()
{
  clearTimeout(time);
  clearSubscriptions();
  keyboard = !keyboard;
  startTimeoutShutdown()
  if(keyboard)
  {
    recorder.stop();
    enableKeyboard();
    textInit();
  }
  else
  {
    recorder.enable();
    disableKeyboard();
    vocalInit();
  }
});

reminderObservable.subscribe(function()
{
  clearSubscriptions();
  reminderInit();
});

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

// funzioni di utilità utilizzate nel resto del main

function vocalInit()
{
  clearSubscriptions();
  logic.setUrl(VOCAL_URL);
  if(enabled) recorder.enable();
  subscriptions.push(player.getObservable().subscribe(
  {
    next: function(playing)
    {
      console.log('Player next', playing);
      if(enabled && !playing)
        recorder.enable();
    },
    error: console.log,
    complete: console.log
  }));

  subscriptions.push(recorder.getObservable().subscribe(
  {
    next: function(blob)
    {
      clearTimeout(time);
      console.log('Recorder next');
      let app = application_manager.application_name || 'conversation';
      blobToBase64(blob)
        .then(function(audio)
        {
          let query =
          {
            app: app,
            audio: audio,
            data: data,
            session_id: session_id
          }
          logic.sendData(query);
          toggleLoading();
        })
        .catch(console.log)
    },
    error: console.log,
    complete: console.log
  }));

  subscriptions.push(logic.getObservable().subscribe(
  {
    next: function(response)
    {
      disableButtonKeyboard(buttonKey); // disabilito pulsante tastiera
      disableButtonReminder(buttonRem);
      if (keyboard)
      {
        clearSubscriptions();
        disableKeyboard();
        player.getObservable().subscribe(
        {
          next: (playing) =>
          {
            if(keyboard && !playing)
            {
              keyboard = false;
              enableButtonKeyboard(buttonKey); // abilito pulsante tastiera
              enableButtonReminder(buttonRem);
              vocalInit();
            }
          }
        });
      }
      else
      {
        player.getObservable().subscribe(
        {
          next: (playing) =>
          {
            if (!playing)
            {
              enableButtonKeyboard(buttonKey); // abilito pulsante tastiera
              enableButtonReminder(buttonRem);
            }
          }
        });
      }
      console.log('logic next');
      data = response.res.data;
      let action = response.action.split('.');
      let app = action[0];
      let cmd = action[1];
      console.log(action, app, cmd);
      application_manager.runApplication(app, cmd, response.res);
      toggleLoading();
      let soll = patt_soll.test(response.res.text_response);
      let sd = patt_shutdown.test(response.res.text_response);
      if (soll)
      {
        start_time = setTimeout(() =>
        {
          showButtonReminder(buttonRem);
        }, start_reminder_button);
      }
      if (sd)
      {
        finish_time = setTimeout(() =>
        {
          resetInterface();
        }, time_shutdown);
      }
      player.speak(response.res.text_response);
      clearTimeout(time);
      startTimeoutShutdown();
    },
    error: function(err)
    {
      application_manager.runApplication(application_manager.application_name, 'receiveMsg', {text_response: 'Error: ' + err.status_text});
      setTimeout(() => vocalInit());  // riavvio l'observable dopo l'errore
    },
    complete: console.log
  }));
}

function textInit()
{
  logic.setUrl(TEXT_URL);
  subscriptions.push(sendObservable.subscribe(
  {
    next: function(event)
    {
      clearTimeout(time);
      event.preventDefault();
      console.log('Text next');
      let app = application_manager.application_name || 'conversation';
      console.log(app);
      let input_text = document.getElementById("inputText").value;
      document.getElementById("inputText").value="";
      if (input_text !== "")
      {
        console.log(input_text);
        let query =
        {
          text : input_text,
          app: app,
          data: data,
          session_id: session_id
        }
        logic.sendData(query);
        toggleLoading();
      }
    },
    error: console.log,
    complete: console.log
  }));

  subscriptions.push(logic.getObservable().subscribe(
  {
    next: function(response)
    {
      if (keyboard)
      {
        clearSubscriptions();
        disableKeyboard();
        disableButtonKeyboard(buttonKey); // disabilito pulsante tastiera
        disableButtonReminder(buttonRem);
        player.getObservable().subscribe(
        {
          next: (playing) =>
          {
            if(keyboard && !playing)
            {
              enableButtonKeyboard(buttonKey); // abilito pulsante tastiera
              enableButtonReminder(buttonRem);
              keyboard = false;
              vocalInit();
            }
          }
        });
      }
      console.log('logic next');
      data = response.res.data;
      let action = response.action.split('.');
      let app = action[0];
      let cmd = action[1];
      console.log(action, app, cmd);
      application_manager.runApplication(app, cmd, response.res);
      toggleLoading();
      let soll = patt_soll.test(response.res.text_response);
      let sd = patt_shutdown.test(response.res.text_response);
      if (soll)
      {
        start_time = setTimeout(() =>
        {
          showButtonReminder(buttonRem);
        }, start_reminder_button);
      }
      if (sd)
      {
        finish_time = setTimeout(() =>
        {
          resetInterface();
        }, time_shutdown);
      }
      player.speak(response.res.text_response);
      clearTimeout(time);
      startTimeoutShutdown()
    },
    error: function(err)
    {
      application_manager.runApplication(application_manager.application_name, 'receiveMsg', {text_response: 'Error: ' + err.status_text});
      setTimeout(() => textInit());
    },
    complete: console.log
  }));
}

function reminderInit()
{
  hideButtonReminder(buttonRem);
  clearTimeout(time);
  logic.setUrl(TEXT_URL);
  let app = application_manager.application_name || 'conversation';
  let query =
  {
    text : 'where required_person is?',
    app: app,
    data: data,
    session_id: session_id
  }
  logic.sendData(query);
  toggleLoading();

  subscriptions.push(logic.getObservable().subscribe(
  {
    next: function(response)
    {
      disableButtonKeyboard(buttonKey); // disabilito pulsante tastiera
      disableButtonReminder(buttonRem);
      if (keyboard)
      {
        clearSubscriptions();
        disableKeyboard();
        player.getObservable().subscribe(
        {
          next: (playing) =>
          {
            if(keyboard && !playing)
            {
              enableButtonKeyboard(buttonKey); // abilito pulsante tastiera
              enableButtonReminder(buttonRem);
              keyboard = false;
              vocalInit();
            }
          }
        });
      }
      else
      {
        player.getObservable().subscribe(
        {
          next: (playing) =>
          {
            if (!playing)
            {
              enableButtonKeyboard(buttonKey); // abilito pulsante tastiera
              enableButtonReminder(buttonRem);
              vocalInit();
            }
          }
        });
      }
      console.log('logic next');
      data = response.res.data;
      let action = response.action.split('.');
      let app = action[0];
      let cmd = action[1];
      console.log(action, app, cmd);
      application_manager.runApplication(app, cmd, response.res);
      toggleLoading();
      player.speak(response.res.text_response);
      clearTimeout(time);
      startTimeoutShutdown();
    },
    error: console.log,
    complete: console.log
  }));
}

function clearSubscriptions()
{
  subscriptions.forEach((sub) => sub.unsubscribe());
}

function resetInterface()
{
  clearSubscriptions();
  hideButtonReminder(buttonRem);
  clearTimeout(time);
  clearTimeout(finish_time);
  clearTimeout(start_time)
  enabled = false;
  changeValueButton();
  recorder.stop();
  application_manager.resetState();
  application_manager.runApplication("conversation", "clear", {})
  session_id = uuidV4();
  if (keyboard)
  {
    keyboard = false;
    disableKeyboard();
  }
  disableButtonKeyboard(buttonKeyboard);
}

function startTimeoutShutdown()
{
  time = setTimeout(() =>
  {
    resetInterface();
  }, max_silence_time);
}
