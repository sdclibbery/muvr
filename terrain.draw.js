(function () {

var vtxShader = `
  uniform float timeIn;
  uniform mat4 perspIn;
  uniform mat4 viewIn;
  uniform vec3 colIn;

  attribute vec3 posIn;

  varying vec3 colour;

  void main() {
    float repeatSize = 4.0;                   // size of one square in the terrain grid
    float speed = repeatSize * 9.0;          // speed of terrain motion in metres per second
    float distance = timeIn * speed;          // current distance the grid origin should have reached
    float delta = mod(distance, repeatSize);  // amount to move the drawn grid so it lines up with where the grid should be
    float index = distance-posIn.z-delta;     // value to use that moves with the grid without snapping back on the repeat
    float wave = 0.5*(sin(posIn.x*(0.14))+sin(index*(0.13)));
    gl_Position = perspIn * viewIn * vec4(posIn.x, posIn.y+wave*3.0, posIn.z + delta, 1); // apply the delta to give the sense of motion
    colour = colIn*(0.3 + pow(abs(wave), 1.5));
  }
`;

var frgShader = `
  precision mediump float;

  varying vec3 colour;

  void main() {
    gl_FragColor = vec4(colour, 1);
  }
`;

var resX = 50;
var resY = 50;
var vtxResX = resX+1;
var vtxResY = resY+1;
var size = 200;

var numVtxs = vtxResX*vtxResY;
var vtxPosns = new Float32Array(numVtxs*3);
for (var y = 0; y < vtxResY; y++) {
  for (var x = 0; x < vtxResX; x++) {
    var v = (x + y*vtxResX) * 3;
    vtxPosns[v+0] = (x - vtxResX/2)*size/vtxResX;
    vtxPosns[v+1] = -10;
    vtxPosns[v+2] = -y*size/vtxResY;
  }
}


var numIndices = resX*resY*6;
var indexBuffer = null;
var indexes = new Uint16Array(numIndices);
for (var y = 0; y < resY; y++) {
  for (var x = 0; x < resX; x++) {
    var i = (x + y*resX) * 6;
    var v = x + y*vtxResX;
    indexes[i+0] = v;
    indexes[i+1] = v+vtxResX;
    indexes[i+2] = v+1;
    indexes[i+3] = v+vtxResX;
    indexes[i+4] = v+1;
    indexes[i+5] = v+vtxResX+1;
  }
}


var program = null;
var posAttr = null;
var posBuf = null;
var perspUnif = null;
var viewUnif = null;
var timeUnif = null;
var colUnif = null;


muvr.draw.prototype.terrain = function () {
  if (program === null) {
    program = this.loadProgram([
      this.loadShader(vtxShader, this.gl.VERTEX_SHADER),
      this.loadShader(frgShader, this.gl.FRAGMENT_SHADER)
    ]);
    posBuf = this.gl.createBuffer();
    indexBuffer = this.createIndexBuffer(indexes);
    posAttr = this.gl.getAttribLocation(program, "posIn");
    perspUnif = this.gl.getUniformLocation(program, "perspIn");
    viewUnif = this.gl.getUniformLocation(program, "viewIn");
    timeUnif = this.gl.getUniformLocation(program, "timeIn");
    colUnif = this.gl.getUniformLocation(program, "colIn");
  }

  this.gl.useProgram(program);

  this.gl.uniform1f(timeUnif, this.time/1000);
  this.gl.uniform3f(colUnif, 0.5, 0.6, 0.8);
  this.gl.uniformMatrix4fv(perspUnif, false, this.perspectiveMatrix());
  this.gl.uniformMatrix4fv(viewUnif, false, this.viewMatrix());

  this.loadVertexAttrib(posBuf, posAttr, vtxPosns, 3);
  this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  this.gl.disable(this.gl.BLEND);
  this.gl.disable(this.gl.CULL_FACE);
  this.gl.drawElements(this.gl.TRIANGLES, numIndices, this.gl.UNSIGNED_SHORT, 0);
};

})();
