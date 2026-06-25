// Create shader from shader type and source string
function createShader(gl, type, source) {
    var shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }
    console.error(gl.getShaderInfoLog(shader));
}

// Create program from array of webgl shaders
function createProgram(gl, shaders) {
    var program = gl.createProgram();

    shaders.forEach(function(shader) {
        gl.attachShader(program, shader);
    });

    gl.linkProgram(program)

    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }
    console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

// Create program from array of shader source strings, shader types, types and string
function createProgramFromSources(gl, shaderSources, types) {
    if (shaderSources.length != types.length) {
        console.error("Sources and types arrays do not match");
        return;
    }

    const shaders = [];
    
    for(let i = 0; i < shaderSources.length; i++) {
        shaders.push(createShader(gl, types[i], shaderSources[i]));
    }

    return createProgram(gl, shaders);
}

// Draw rectangle
function setRectangle(gl, x, y, width, height) {
  var x1 = x;
  var x2 = x + width;
  var y1 = y;
  var y2 = y + height;
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
     x1, y1,
     x2, y1,
     x1, y2,
     x1, y2,
     x2, y1,
     x2, y2,
  ]), gl.STATIC_DRAW);
}

// Fix canvas display sizing
function resizeCanvasToDisplaySize(canvas, multiplier) {
    multiplier = multiplier || 1;
    const width  = canvas.clientWidth  * multiplier | 0;
    const height = canvas.clientHeight * multiplier | 0;
    if (canvas.width !== width ||  canvas.height !== height) {
      canvas.width  = width;
      canvas.height = height;
      return true;
    }
    return false;
}