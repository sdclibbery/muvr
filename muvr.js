(function () {

muvr = {};

var draw;
var terrain;

muvr.begin = function () {
  draw = new muvr.draw();
  terrain = new muvr.terrain();
};

muvr.orientate = function (yaw, pitch, roll) {
  const deg2rad = Math.PI / 180;
  draw.orientate(Quaternion.fromEuler(yaw*deg2rad, pitch*deg2rad, roll*deg2rad, 'ZXY'));
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
