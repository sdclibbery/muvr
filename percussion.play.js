// Adapter for percussion audio

var percussion = {};
muvr.play.percussion = percussion;

percussion.closedhat = function (time) {
  playCymbal(0.3, 0.5, time);
};

percussion.openhat = function (time) {
  playCymbal(1, 0.4, time);
};

percussion.snare = function (time) {
  playNoise(0.02, 0.3, 5000, 2.0, time);
};

percussion.kick = function (time) {
  playNoise(0.02, 0.11, 50, 70.0, time);
};

var playCymbal = function (decay, gain, time) {
  var attack = 0;
  var duration = attack + decay;

  var vca = play.audio.createGain();
  vca.gain.value = 0;

  var vco = play.audio.createOscillator();
  vco.type = 'square';
  vco.frequency.value = 2490;

  var lfo = play.audio.createOscillator();
  lfo.type = 'square';
  lfo.frequency.value = 1047;

  var lfoGain = play.audio.createGain();
  lfoGain.gain.value = vco.frequency.value*10;

  var hipass = play.audio.createBiquadFilter();
  hipass.type = 'highpass';
  hipass.frequency.value = 2640;
  hipass.frequency.linearRampToValueAtTime(8000, time+1);

  lfo.connect(lfoGain);
  lfoGain.connect(vco.frequency);
  vco.connect(hipass);
  hipass.connect(vca);
  play.mix(vca);

  vco.start(time);
  lfo.start(time);
  vca.gain.linearRampToValueAtTime(gain, time + attack);
  vca.gain.exponentialRampToValueAtTime(0.001, time + duration);
  vco.stop(time + duration);
  lfo.stop(time + duration);
}

var noiseBuffer;
var playNoise = function (attack, decay, cutoff, gain, time) {
  if (!noiseBuffer) {
    var bufferSize = 2 * play.audio.sampleRate;
    noiseBuffer = play.audio.createBuffer(1, bufferSize, play.audio.sampleRate);
    var output = noiseBuffer.getChannelData(0);
    for (var i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }
  }
  var duration = attack + decay;
  var vca = play.audio.createGain();
  play.mix(vca);
  vca.gain.value = 0.0;

  var whiteNoise = play.audio.createBufferSource();
  whiteNoise.buffer = noiseBuffer;
  whiteNoise.start(time);

  var lowpass = play.audio.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.value = cutoff;
  lowpass.frequency.linearRampToValueAtTime(cutoff/2, time+duration);
  whiteNoise.connect(lowpass);
  lowpass.connect(vca);

  vca.gain.linearRampToValueAtTime(gain, time + attack);
  vca.gain.exponentialRampToValueAtTime(0.001, time + duration);
  whiteNoise.stop(time + duration);
};
