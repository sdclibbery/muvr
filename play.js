// Adapter for audio playback

var ffts = {};

var play = {
  audio: new AudioContext(),
};
muvr.play = play;

play.timeNow = function () {
  return play.audio.currentTime;
};

play.mix = function (node) {
  node.connect(play.reverb);
  node.connect(play.audio.destination);
};

var _initReverb = function () {
  play.reverb = play.audio.createConvolver();
  var seconds = 1;
  var decay = 5;
  var rate = play.audio.sampleRate;
  var length = rate * seconds;
  var impulse = play.audio.createBuffer(2, length, rate);
  var impulseL = impulse.getChannelData(0);
  var impulseR = impulse.getChannelData(1);
  for (var i = 0; i < length; i++) {
    impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
  }
  play.reverb.buffer = impulse;
  play.reverb.connect(play.audio.destination);
};
_initReverb();
