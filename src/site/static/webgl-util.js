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

// Calculate points of rectangle
function getRectangle(x, y, width, height) {
    return {
        x1: x,
        x2: x + width,
        y1: y,
        y2: y + height
    };
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