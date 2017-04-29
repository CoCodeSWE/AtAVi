var synth = window.speechSynthesis;
var voices = synth.getVoices();
var option =
{
  lang : 'en-US',
  pitch : 1,
  rate : 1,
  voice : voices[0],
  volume : 0.5
};
var firstStart = 0;
var player = new Player(option, synth);

function startAndStop()
{
  var li = document.getElementById('listMessages').lastChild.innerHTML;
  player.speak(li);
}
