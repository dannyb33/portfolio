"use strict"

var vertexShaderSource = `#version 300 es

in vec2 a_position;

uniform vec2 u_resolution;
uniform vec2 u_speed;
uniform float u_time;

void main() {
    vec2 zeroToOne = a_position / u_resolution;
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;

    float xOffset = sin(u_time * u_speed.x);

    vec2 translated = clipSpace + vec2(xOffset, 0.0);

    gl_Position = vec4(translated, 0.0, 1.0);
}
`;

var fragmentShaderSource = `#version 300 es

precision highp float;

uniform vec4 u_color;

out vec4 outColor;

void main() {
  outColor = u_color;
}
`;

// Color variants for rendered boxes
const colors = [
    [189/255, 196/255, 255/255],
    [217/255, 220/255, 255/255],
    [229/255, 232/255, 255/255],
    [237/255, 240/255, 255/255]
];

// Random int from min to max, inclusive
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + 1) + min;
}

function main() {
    var canvas = document.querySelector(".graphic");

    var gl = canvas.getContext("webgl2");
    if(!gl) {
        console.error("GL not found");
        return;
    }

    var program = createProgramFromSources(gl, [vertexShaderSource, fragmentShaderSource], [gl.VERTEX_SHADER, gl.FRAGMENT_SHADER]);

    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    var colorLocation = gl.getUniformLocation(program, "u_color");
    var speedLocation = gl.getUniformLocation(program, "u_speed")
    var timeLocation = gl.getUniformLocation(program, "u_time");

    var positionBuffer = gl.createBuffer();

    var vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(positionAttributeLocation);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

    resizeCanvasToDisplaySize(gl.canvas);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    var shapes = [];
    var shapesToDraw = [];

    for (var j = 0; j < 50; j++) {
        var colorIndex = randomInt(0, colors.length - 1);
        var translation = [];

        const width = randomInt(300, 500);
        const height = randomInt(300, 500);

        console.log(gl.canvas.width);
        console.log(gl.canvas.height);

        const x = randomInt(0, Math.max(0, gl.canvas.width - width));
        const y = randomInt(0, Math.max(0, gl.canvas.height - height));

        const rectangle = getRectangle(x, y, width, height);
        
        var shape = {
            translation: rectangle,
            color: colors[colorIndex],
            speed: [randomInt(-5, 5) || 1, randomInt(-5, 5) || 1]
        };

        console.log(shape)
        shapes.push(shape);
    }

    requestAnimationFrame(render)

    function render(time) {
        time = time * 0.00005;

        resizeCanvasToDisplaySize(gl.canvas);

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.useProgram(program);

        gl.bindVertexArray(vao);

        gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

        shapes.forEach(function(shape) {
            gl.uniform4f(colorLocation, shape.color[0], shape.color[1], shape.color[2], 1);
            gl.uniform2f(speedLocation, shape.speed[0], shape.speed[1]);
            gl.uniform1f(timeLocation, time);

            var primitiveType = gl.TRIANGLES;
            var offset = 0;
            var count = 6;

            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
                shape.translation.x1, shape.translation.y1,
                shape.translation.x2, shape.translation.y1,
                shape.translation.x1, shape.translation.y2,
                shape.translation.x1, shape.translation.y2,
                shape.translation.x2, shape.translation.y1,
                shape.translation.x2, shape.translation.y2,
            ]), gl.STATIC_DRAW);

            gl.drawArrays(primitiveType, offset, count);
        });

        requestAnimationFrame(render);
    }
}

main();