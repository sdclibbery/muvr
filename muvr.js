(function () {

muvr = {};

var draw;
var terrain;

muvr.begin = function () {
  draw = new muvr.draw();
  terrain = new muvr.terrain();
};

muvr.orientate = function (yaw, pitch, roll) {
  document.getElementById("debug-console").innerHTML = `yaw: ${yaw.toFixed(1)}  pitch: ${pitch.toFixed(1)}  roll: ${roll.toFixed(1)}`;

  const phoneIsLandscape = false;
  if (phoneIsLandscape) {
    draw.orientate(yaw, 90-pitch, pitch);
  } else {
    draw.orientate(yaw, 90-pitch, roll);
  }
};

function renderScene () {
  terrain.render(draw);
}

muvr.frame = function (t, dt, gl, cw, ch) {
  if (dt > 0.1) { console.log("Long frame: "+dt); }

  draw.frameStart(t, gl, cw, ch);
  draw.leftStart();
  renderScene();
  draw.rightStart();
  renderScene();
};

})();
