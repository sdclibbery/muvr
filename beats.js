var metronome = muvr.metronome;

var beats = {};
muvr.beats = beats;

var values = [ // Each beat is an array of divisions; each division is a value
  ['kick', 'openhat'], ['snare', 'openhat'], ['kick', 'openhat'], ['snare', 'openhat']
];
var nextBeatIdx = 0;

metronome.listen(function (beat) {
  beats.next(beat).map(
    (event) => muvr.play.percussion[event.value](event.time)
  );
});

beats.values = function (vs) {
  values = vs;
  nextBeatIdx = nextBeatIdx % (values.length || 1);
};

beats.next = function (beat) {
  if (values.length === 0) { return []; }
  var events = [];
  var valuesIdx = Math.min(nextBeatIdx % beat.beatsPerMeasure, values.length-1);
  events = values[valuesIdx].map(function (value, idx, ds) {
    if (value) {
      var event = {};
      event.time = beat.time + beat.duration * (idx / ds.length);
      event.value = value;
      event.beat = beat;
      return event;
    }
  }).filter(function (v) { return !!v; });
  nextBeatIdx = (nextBeatIdx + 1) % beat.beatsPerMeasure;
  return events;
};
