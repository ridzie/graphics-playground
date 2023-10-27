const { mat4 } = glMatrix;
const toRad = glMatrix.glMatrix.toRadian;

const shapes = [];
let gl = null;

const locations = {
    attributes: {
        vertexLocation: null,
        colorLocation: null
    }, uniforms: {
        modelViewMatrix: null,
        projectionMatrix: null,
    }
}

const viewMatrix = mat4.create();

window.onload = async () => {

    /* --------- basic setup --------- */
    let canvas = document.getElementById("canvas");
    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    gl.enable(gl.DEPTH_TEST);
    gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);
    gl.clearColor(0.729, 0.764, 0.674, 1);

    const program = createShaderProgram("v-shader", "f-shader");
    gl.useProgram(program);

    /* --------- save attribute & uniform locations --------- */
    locations.attributes.vertexLocation = gl.getAttribLocation(program, "vertexPosition");
    locations.attributes.colorLocation = gl.getAttribLocation(program, "vertexColor");
    locations.uniforms.modelViewMatrix = gl.getUniformLocation(program, "modelViewMatrix");
    locations.uniforms.projectionMatrix = gl.getUniformLocation(program, "projectionMatrix");

    /* --------- create & send projection matrix --------- */
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, toRad(45), canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    gl.uniformMatrix4fv(locations.uniforms.projectionMatrix, gl.FALSE, projectionMatrix);

    /* --------- create view matrix --------- */
    mat4.lookAt(viewMatrix, [0, 0, 2], [0, 0, 0], [0, 1, 0]);

    /* --------- translate view matrix --------- */
    mat4.translate(viewMatrix, viewMatrix, [-0.5, 0, 0])

    /* --------- create 2 cubes and translate them away from each other --------- 
    shapes.push(createShape());
    shapes[0].translate([-0.8, 0.5, 0]);

    shapes.push(createShape());
    shapes[1].translate([1.8, 0.5, 0]);*/


    for (let i = 0; i < 9; i++) {

        if(i <6)
        {
            shapes.push(createCube());
        }
        else
        {
            shapes.push(createCone());
        }
        //const shape = createCone();
        let xTranslation, yTranslation;

        // Define the x and y translations based on the index 'i'
        if (i < 3) {
            xTranslation = .6 * (i % 3);
            yTranslation = .6;
        } else if (i < 6) {
            xTranslation = .6 * (i % 3);
            yTranslation = 0;
        } else {
            xTranslation = .6 * (i % 3);
            yTranslation = -0.6;
        }

        // Translate the shape
        shapes[i].translate([xTranslation, yTranslation, 0]);

        // Add the shape to the array
        //shapes.push(shape);
    }

    /* --------- Attach event listener for keyboard events to the window --------- */
    window.addEventListener("keydown", (event) => {
        /* ----- this event contains all the information you will need to process user interaction ---- */
        console.log(event)
        switch (event.key) {
            case 'ArrowUp':
                mat4.translate(viewMatrix, viewMatrix, [0, 0.1, 0])
                break;
            case 'ArrowDown':
                mat4.translate(viewMatrix, viewMatrix, [0, -0.1, 0])
                break;
            case 'ArrowLeft':
                mat4.translate(viewMatrix, viewMatrix, [0.1, 0, 0])
                break;
            case 'ArrowRight':
                mat4.translate(viewMatrix, viewMatrix, [-0.1, 0, 0])
                break;
            default:
                break;
        }

    })


    let isDragging = false;
    let dragStartX, dragStartY,cameraPositionX=0,cameraPositionY=0;

    // Add a mousedown event listener to start tracking the drag
    window.addEventListener('mousedown', (event) => {
        isDragging = true;
        dragStartX = event.clientX;
        dragStartY = event.clientY;
    });

    // Add a mousemove event listener to update the position during the drag
    window.addEventListener('mousemove', (event) => {
        if (isDragging) {
            const deltaX = event.clientX - dragStartX;
            const deltaY = event.clientY - dragStartY;

            // Use deltaX and deltaY to update your scene or camera position
            cameraPositionX += deltaX;
            cameraPositionY += deltaY;
            mat4.translate(viewMatrix, viewMatrix, [cameraPositionX*0.1, cameraPositionY*0.1, 0])

            // Update the drag start position
            dragStartX = event.clientX;
            dragStartY = event.clientY;
        }
    });

    // Add a mouseup event listener to stop tracking the drag
    window.addEventListener('mouseup', () => {
        isDragging = false;
    });


    /* --------- Load some data from external files - only works with an http server --------- */
    //  await loadSomething();

    /* --------- start render loop --------- */
    requestAnimationFrame(render);
}

/* --------- simple example of loading external files --------- */
async function loadSomething() {
    const data = await fetch('helpers.js').then(result => result.text());
    console.log(data);
}

let then = 0;

function render(now) {
    /* --------- calculate time per frame in seconds --------- */
    let delta = now - then;
    delta *= 0.001;
    then = now;

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    shapes.forEach(shape => {
        /* --------- scale rotation amount by time difference --------- */
        shape.rotate(1 * delta, [0, 1, 1]);
        shape.draw();
    });
    
    requestAnimationFrame(render)
}

function createCone() {
    const vertices = [];
    const colors = [];

    const numSlices = 20; // Number of slices for the cone
    const height = 0.4;   // Height of the cone
    const radius = 0.15;   // Radius of the base of the cone

    // Define the top vertex
    vertices.push(0.0, 0.0, height, 1.0);
    colors.push(1.0, 0.0, 0.0, 1.0); // Red

    // Create vertices for the base of the cone with different colors
    for (let i = 0; i < numSlices; i++) {
        const angle = (i / numSlices) * 2 * Math.PI;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);

        vertices.push(x, y, 0.0, 1.0);

        // Generate a different color for each slice
        const sliceColor = [
            Math.random(), // Red
            Math.random(), // Green
            Math.random(), // Blue
            1.0 // Alpha
        ];
        colors.push(sliceColor);
    }

    // Create triangles to connect the top, base vertices, and base center with different colors
    for (let i = 1; i <= numSlices; i++) {
        const j = (i % numSlices) + 1; // Next vertex
        vertices.push(0.0, 0.0, height, 1.0); // Top vertex
        vertices.push(vertices[i * 4], vertices[i * 4 + 1], 0.0, 1.0); // Current base vertex
        vertices.push(vertices[j * 4], vertices[j * 4 + 1], 0.0, 1.0); // Next base vertex

        // Generate a different color for each triangle
        const triangleColor = [
            Math.random(), // Red
            Math.random(), // Green
            Math.random(), // Blue
            1.0 // Alpha
        ];
        colors.push(triangleColor);
        colors.push(triangleColor);
        colors.push(triangleColor);
    }

    // Add a base center vertex and color
    vertices.push(0.0, 0.0, 0.0, 1.0);
    colors.push(1.0, 0.0, 0.0, 1.0); // Red

    const cone = new Shape();
    cone.initData(vertices, colors);

    return cone;
}

function createCube() {
    /* --------- define vertex positions & colors --------- */
    /* -------------- 3 vertices per triangle ------------- */
    const vertices = [
        // X, Y, Z, W
        0.1, 0.1, 0.1, 1,
        -0.1, 0.1, 0.1, 1,
        0.1, -0.1, 0.1, 1,

        -0.1, 0.1, 0.1, 1,
        -0.1, -0.1, 0.1, 1,
        0.1, -0.1, 0.1, 1, // front face end

        -0.1, -0.1, -0.1, 1,
        -0.1, -0.1, 0.1, 1,
        -0.1, 0.1, 0.1, 1,

        -0.1, -0.1, -0.1, 1,
        -0.1, 0.1, 0.1, 1,
        -0.1, 0.1, -0.1, 1, // left face end

        0.1, 0.1, -0.1, 1,
        -0.1, -0.1, -0.1, 1,
        -0.1, 0.1, -0.1, 1,

        0.1, 0.1, -0.1, 1,
        0.1, -0.1, -0.1, 1,
        -0.1, -0.1, -0.1, 1, // back face end

        0.1, -0.1, 0.1, 1,
        -0.1, -0.1, -0.1, 1,
        0.1, -0.1, -0.1, 1,

        0.1, -0.1, 0.1, 1,
        -0.1, -0.1, 0.1, 1,
        -0.1, -0.1, -0.1, 1, // bottom face end

        0.1, 0.1, 0.1, 1,
        0.1, -0.1, -0.1, 1,
        0.1, 0.1, -0.1, 1,

        0.1, -0.1, -0.1, 1,
        0.1, 0.1, 0.1, 1,
        0.1, -0.1, 0.1, 1, // right face end

        0.1, 0.1, 0.1, 1,
        0.1, 0.1, -0.1, 1,
        -0.1, 0.1, -0.1, 1,

        0.1, 0.1, 0.1, 1,
        -0.1, 0.1, -0.1, 1,
        -0.1, 0.1, 0.1, 1, // Top face end
    ];

    const colorData = [
        [0.0, 0.0, 0.0, 1.0],    // Front face: black
        [1.0, 0.0, 0.0, 1.0],    // left face: red
        [0.0, 1.0, 0.0, 1.0],    // back face: green
        [0.0, 0.0, 1.0, 1.0],    // Bottom face: blue
        [1.0, 1.0, 0.0, 1.0],    // Right face: yellow
        [1.0, 0.0, 1.0, 1.0],    // top face: purple
    ];

    const colors = [];

    /* --------- add one color per face, so 6 times for each color --------- */
    colorData.forEach(color => {
        for (let i = 0; i < 6; ++i) {
            colors.push(color);
        }
    });

    /* --------- create shape object and initialize data --------- */
    const cube = new Shape();
    cube.initData(vertices, colors)

    return cube;
}
