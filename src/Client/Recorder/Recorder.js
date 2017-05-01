(function(window)
{

  var WORKER_PATH = 'js/recorderjs/RecorderWorker.js';

  var Recorder = function(cfg)
  {
    //create source
    //window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var audioContext = new AudioContext();
    var audioInput = null;
    var realAudioInput = null;
    var inputPoint = null;
    var audioRecorder = null;
    var analyserNode;
    var source;
    var config = cfg || {};
    var worker = new Worker(config.workerPath || WORKER_PATH);
    var onComplete = cfg.oncomplete;
    var recording = false;
    worker.onmessage = function(e)
    {
      switch (e.data.type)
      {
        case 'buffers':
          let audio_buffer = audioContext.createBuffer(2, e.data.length, audioContext.sampleRate);
          audio_buffer.copyToChannel(e.data.buffers[1], 1);
          audio_buffer.copyToChannel(e.data.buffers[0], 0);
          resampler(audio_buffer, 16000, function(buffer)
          {
            array = buffer.getChannelData(0);
            worker.postMessage({command: 'encodeWAV', buffer: array, mono: true});
          });
          break;
        case 'wav':
          onComplete(e.data.blob);
      }
      //var blob = e.data;
    }
    let self = this;
    var bufferLen = config.bufferLen || 4096;


    if (!navigator.mediaDevices.getUserMedia)
      navigator.mediaDevices.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    if (!navigator.cancelAnimationFrame)
      navigator.cancelAnimationFrame = navigator.webkitCancelAnimationFrame || navigator.mozCancelAnimationFrame;
    if (!navigator.requestAnimationFrame)
      navigator.requestAnimationFrame = navigator.webkitRequestAnimationFrame || navigator.mozRequestAnimationFrame;

    this.gotStream = function(stream)
    {
      inputPoint = audioContext.createGain();

      // Create an AudioNode from the stream.
      realAudioInput = audioContext.createMediaStreamSource(stream);
      audioInput = realAudioInput;
      audioInput.connect(inputPoint);

      analyserNode = audioContext.createAnalyser();
      analyserNode.fftSize = 2048;
      inputPoint.connect(analyserNode);

      source = inputPoint;
      zeroGain = audioContext.createGain();
      zeroGain.gain.value = 0.0;
      inputPoint.connect(zeroGain);
      zeroGain.connect(audioContext.destination);


      this.context = source.context;
      if (!this.context.createScriptProcessor)
      {
        this.node = this.context.createJavaScriptNode(bufferLen, 2, 2);
      }
      else
      {
        this.node = this.context.createScriptProcessor(bufferLen, 2, 2);
      }

      worker.postMessage(
      {
        command: 'init',
        config:
        {
          sampleRate: 16000
        }
      });
      recording = false;
      var time;
      this.node.onaudioprocess = function(e)
      {
        var volData = new Uint8Array(analyserNode.fftSize);
        analyserNode.getByteFrequencyData(volData);
        var volume = getAverageVolume(volData);
        if (!recording && volume > config.threshold)
        {
          if (time)
          {
            clearTimeout(time);
            time = null;
          }
          self.start();
        }
        if (recording)
        {
          if (config.max_silence !== -1 && !time && volume < config.threshold)
          {
            time = setTimeout(function()
            {
              self.stop();
            }, config.max_silence);
          }
          worker.postMessage(
          {
            command: 'record',
            buffer: [
              e.inputBuffer.getChannelData(0),
              e.inputBuffer.getChannelData(1)
            ]
          });
        }
      }

      source.connect(this.node);
      this.node.connect(this.context.destination); // if the script node is not connected to an output the "onaudioprocess" event is not triggered in chrome.
    }

    navigator.mediaDevices.getUserMedia(
    {
      "audio":
      {
        "mandatory":
        {
          "googEchoCancellation": "false",
          "googAutoGainControl": "false",
          "googNoiseSuppression": "false",
          "googHighpassFilter": "false"
        },
        "optional": []
      },
    }).then(this.gotStream.bind(this)).catch(function(e)
    {
      alert('Error getting audio');
    });

    this.setConfig = function(cfg)
    {
      for (var prop in cfg)
      {
        if (cfg.hasOwnProperty(prop))
        {
          config[prop] = cfg[prop];
        }
      }
    }

    this.start = function()
    {
      recording = true;
    }

    this.stop = function()
    {
      recording = false;
    }

    this.clear = function()
    {
      worker.postMessage(
      {
        command: 'clear'
      });
    }

    this.getBuffers = function(cb)
    {
      onComplete = cb || config.oncomplete;
      worker.postMessage(
      {
        command: 'getBuffers'
      });
    }

    this.exportWAV = function(cb, type)
    {
      currCallback = cb || config.callback;
      type = type || config.type || 'audio/wav';
      if (!currCallback) throw new Error('Callback not set');
      worker.postMessage(
      {
        command: 'exportWAV',
        type: type
      });
    }

    this.exportMonoWAV = function(cb, type)
    {
      currCallback = cb || config.callback;
      type = type || config.type || 'audio/wav';
      if (!currCallback) throw new Error('Callback not set');
      worker.postMessage(
      {
        command: 'exportMonoWAV',
        type: type
      });
    }
  };

  Recorder.setupDownload = function(blob, filename)
  {
    var url = (window.URL || window.webkitURL).createObjectURL(blob);
    var link = document.getElementById("save");
    link.href = url;
    link.download = filename || 'output.wav';
  }

  window.Recorder = Recorder;
})(window);

function getAverageVolume(array)
{
  var values = 0;
  var average;

  var length = array.length;

  // get all the frequency amplitudes
  for (var i = 0; i < length; i++)
  {
    values += array[i];
  }

  average = values / length;
  return average;
}

function resampler(audioBuffer, targetSampleRate, oncomplete)
{
  var numCh_ = audioBuffer.numberOfChannels;
  var numFrames_ = audioBuffer.length * targetSampleRate / audioBuffer.sampleRate;
  var offlineContext_ = new OfflineAudioContext(numCh_, numFrames_, targetSampleRate);
  var bufferSource_ = offlineContext_.createBufferSource();
  bufferSource_.buffer = audioBuffer;

  offlineContext_.oncomplete = function(event)
  {
    var resampeledBuffer = event.renderedBuffer;
    if (typeof oncomplete === 'function')
    {
      oncomplete(resampeledBuffer);
    }
  };

  bufferSource_.connect(offlineContext_.destination);
  bufferSource_.start(0);
  offlineContext_.startRendering();
}
