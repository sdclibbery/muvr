(function () {

muvr = {}

var terrain;

muvr.begin = function () {
  draw = new muvr.draw();
  terrain = new muvr.terrain();
};

muvr.frame = function (t, dt, gl, cw, ch) {
  if (dt > 0.1) { console.log("Long frame: "+dt); }

  draw.frameStart(t, gl, cw, ch);
  terrain.render(draw);
};

})();
