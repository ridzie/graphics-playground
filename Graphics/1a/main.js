

window.onload = function() {
    const canvas = document.getElementById('1aCanvas');
    const gl = canvas.getContext('webgl');

    gl.enable(gl.DEPTH_TEST);
    gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);
    gl.clearColor(0.729, 0.764, 0.674, 1);

    if (!gl) {
        console.error('WebGL is not supported. Please use a compatible browser.');
        return;
    }
    
    const vertexShaderSource = `
    precision mediump float;

    attribute vec4 vertexPosition; 
    attribute vec4 vertexColor;    

    varying vec4 fragmentColor;    

    void main() {
        gl_Position = vertexPosition; 
        fragmentColor = vertexColor; 
    }
    `;
    const fragmentShaderSource = `
    precision mediump float;

    varying vec4 fragmentColor;

    void main() {
        gl_FragColor = fragmentColor;
    }
    `;
}