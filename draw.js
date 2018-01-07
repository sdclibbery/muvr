
const fovy = 1.7;
const near = 0.001;
const far = 100;
const eyeGap = 1;

muvr.draw = function () {
  this.time = 0;
  this.gl = null;
  this.cw = 1;
  this.ch = 1;
  this._viewMatrix = new Float32Array(16);
};

muvr.draw.prototype.frameStart = function (t, gl, cw, ch) {
  this.time = t;
  if (!this.gl) {
    this.gl = gl;
  }
  this.cw = cw;
  this.ch = ch;
  this._perspectiveMatrix = createPerspectiveMatrix(this.cw / this.ch, 0);
  this.gl.viewport(0, 0, this.cw, this.ch);

  this.gl.clearColor(0, 0, 0, 1);
  this.gl.enable(this.gl.DEPTH_TEST);
  this.gl.depthFunc(this.gl.LEQUAL);
  this.gl.clear(this.gl.COLOR_BUFFER_BIT|this.gl.DEPTH_BUFFER_BIT);
};

muvr.draw.prototype.leftStart = function () {
  this._perspectiveMatrix = createPerspectiveMatrix(this.cw/2 / this.ch, -eyeGap/2);
  this.gl.viewport(0, 0, this.cw/2, this.ch);
};

muvr.draw.prototype.rightStart = function () {
  this._perspectiveMatrix = createPerspectiveMatrix(this.cw/2 / this.ch, eyeGap/2);
  this.gl.viewport(this.cw/2, 0, this.cw/2, this.ch);
};

muvr.draw.prototype.viewMatrix = function () {
  return this._viewMatrix;
};

muvr.draw.prototype.orientate = function (yaw, pitch, roll) {
  let m = this._viewMatrix;
  const pi = 3.14159265359;
  const deg2rad = 2*pi/360;
  const sp = Math.sin(pitch*deg2rad);
  const cp = Math.cos(pitch*deg2rad);
  m[0]  = 1;   m[1] =  0;     m[2] =  0;    m[3] =  0;
  m[4]  = 0;   m[5] =  cp;    m[6] =  sp;   m[7] =  0;
  m[8]  = 0;   m[9] =  -sp;   m[10] = cp;   m[11] = 0;
  m[12] = 0;   m[13] = 0;     m[14] = 0;    m[15] = 1;
};

muvr.draw.prototype.perspectiveMatrix = function () {
  return this._perspectiveMatrix;
};

const createPerspectiveMatrix = function (aspect, offset) {
  const f = 1.0 / Math.tan(fovy / 2);
  const nf = 1 / (near - far);
  const out = new Float32Array(16);
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = (far + near) * nf;
  out[11] = -1;
  out[12] = offset;
  out[13] = 0;
  out[14] = (2 * far * near) * nf;
  out[15] = 0;
  return out;
};

muvr.draw.prototype.xFromCanvas = function (x) {
  return (x*2 - this.cw) / this.ch;
};
muvr.draw.prototype.yFromCanvas = function (y) {
  return 1 - y*2/this.ch;
};
muvr.draw.prototype.toX = function (x) {
  return x * this.ch / this.cw;
};

muvr.draw.prototype.squareVtxs = function (x, y, size) {
  var hs = size/2;
  var l = this.toX(x - hs);
  var r = this.toX(x + hs);
  var b = y - hs;
  var t = y + hs;
  return {
    vtx: new Float32Array([
      l, t,
      r, t,
      l, b,
      l, b,
      r, t,
      r, b]),
    tex: new Float32Array([
      0.0, 0.0,
      1.0, 0.0,
      0.0, 1.0,
      0.0, 1.0,
      1.0, 0.0,
      1.0, 1.0
    ])};
};

muvr.draw.prototype.createIndexBuffer = function (indexes) {
  var buffer = this.gl.createBuffer();
  this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buffer);
  this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, indexes, this.gl.STATIC_DRAW);
  return buffer;
};

muvr.draw.prototype.loadVertexAttrib = function (buffer, attr, data, stride) {
  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
  this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
  this.gl.enableVertexAttribArray(attr);
  this.gl.vertexAttribPointer(attr, stride, this.gl.FLOAT, false, 0, 0);
};

muvr.draw.prototype.loadShader = function(shaderSource, shaderType) {
  var gl = this.gl;
  var shader = gl.createShader(shaderType);

  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);

  var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!compiled) {
    console.log("*** Error compiling shader :" + gl.getShaderInfoLog(shader) + "\nSource: " + shaderSource);
    gl.deleteShader(shader);
    return null;
  }

  return shader;
};

muvr.draw.prototype.loadProgram = function(shaders, opt_attribs, opt_locations) {
  var gl = this.gl;
  var program = gl.createProgram();
  for (var ii = 0; ii < shaders.length; ++ii) {
    gl.attachShader(program, shaders[ii]);
  }
  if (opt_attribs) {
    for (var ii = 0; ii < opt_attribs.length; ++ii) {
      gl.bindAttribLocation(
          program,
          opt_locations ? opt_locations[ii] : ii,
          opt_attribs[ii]);
    }
  }
  gl.linkProgram(program);

  var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linked) {
      console.log("Error in program linking:" + gl.getProgramInfoLog (program));
      gl.deleteProgram(program);
      return null;
  }
  return program;
};
