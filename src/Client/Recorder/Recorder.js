(function(window)
{

  var WORKER_PATH = 'js/recorderjs/recorderWorker.js';

  var Recorder = function(cfg)
  {
    //create source
    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    var audioContext = new AudioContext();
    var audioInput = null,
    realAudioInput = null,
    inputPoint = null,
    audioRecorder = null,
    analyserNode,
    source;
    var self = this;
    var config = cfg || {};
    var bufferLen = config.bufferLen || 4096;


    if (!navigator.mediaDevices.getUserMedia)
            navigator.mediaDevices.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        if (!navigator.cancelAnimationFrame)
            navigator.cancelAnimationFrame = navigator.webkitCancelAnimationFrame || navigator.mozCancelAnimationFrame;
        if (!navigator.requestAnimationFrame)
            navigator.requestAnimationFrame = navigator.webkitRequestAnimationFrame || navigator.mozRequestAnimationFrame;

    navigator.mediaDevices.getUserMedia(
        {
            "audio": {
                "mandatory": {
                    "googEchoCancellation": "false",
                    "googAutoGainControl": "false",
                    "googNoiseSuppression": "false",
                    "googHighpassFilter": "false"
                },
                "optional": []
            },
        }).then(gotStream).catch(function(e) {
            alert('Error getting audio');
            console.log(e);
        });

    this.gotStream(stream)
    {
      inputPoint = audioContext.createGain();

      // Create an AudioNode from the stream.
      realAudioInput = audioContext.createMediaStreamSource(stream);
      audioInput = realAudioInput;
      audioInput.connect(inputPoint);

      analyserNode = audioContext.createAnalyser();
      analyserNode.fftSize = 2048;
      inputPoint.connect( analyserNode );

      source = inputPoint;
    }



    this.context = source.context;
    if(!this.context.createScriptProcessor)
    {
      this.node = this.context.createJavaScriptNode(bufferLen, 2, 2);
    }
    else
    {
      this.node = this.context.createScriptProcessor(bufferLen, 2, 2);
    }

    var worker = new Worker(config.workerPath || WORKER_PATH);
    worker.postMessage(
    {
      command: 'init',
      config:
      {
        sampleRate: this.context.sampleRate
      }
    });
    var recording = false,
    currCallback;

    var time;

    this.node.onaudioprocess = function(e)
    {
      var timeByteData = new Float32Array(analyserNode.fftSize);
      var volume = getAverageVolume(timeByteData);
      if (!recording && volume > config.threshold)
      {
          if (time)
          {
            clearTimeout(time);
            time = null;
          }
          this.start();
      }
      if (recording)
      {
        if (config.max_silence !== -1 && !time && volume<config.threshold)
        {
          time = setTimeoout(function()
          {
            self.stop();
          },config.max_silence);
        worker.postMessage(
        {
          command: 'record',
          buffer:
          [
            e.inputBuffer.getChannelData(0),
            e.inputBuffer.getChannelData(1)
          ]
        });
      }
    }

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


    this.stop = function()
    {
      recording = false;
    }

    this.clear = function()
    {
      worker.postMessage({ command: 'clear' });
    }

    this.getBuffers = function(cb)
    {
      currCallback = cb || config.callback;
      worker.postMessage({ command: 'getBuffers' })
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

    worker.onMessage = function(e)
    {
      var blob = e.data;
      currCallback(blob);
    }

    source.connect(this.node);
    this.node.connect(this.context.destination);   // if the script node is not connected to an output the "onaudioprocess" event is not triggered in chrome.
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
