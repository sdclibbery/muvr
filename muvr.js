(function () {

muvr = {};

var draw;
var terrain;

muvr.begin = function () {
  draw = new muvr.draw();
  terrain = new muvr.terrain();
};

muvr.orientate = function (yaw, pitch, roll) {
  draw.orientate(yaw, 90-pitch, roll);
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
