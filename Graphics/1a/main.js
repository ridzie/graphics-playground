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
//confusion is key
const fragmentShaderSource = `
precision mediump float;

varying vec4 fragmentColor;

void main() {
    gl_FragColor = fragmentColor;
}
`;