(function () {

muvr = {};

var draw;
var terrain;

muvr.begin = function () {
  draw = new muvr.draw();
  terrain = new muvr.terrain();
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
