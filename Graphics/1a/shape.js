class Shape {
    constructor() {
        this.vertices = [];
        this.colors = [];

        this.buffers = {
            /* --------- initialize buffers --------- */
            vertexBuffer: gl.createBuffer(),
            colorBuffer: gl.createBuffer(),
        }

        /* --------- initialize model matrix --------- */
        this.modelMatrix = mat4.create();
    }

    initData(vertices, colors) {
        /* --------- flatten & convert data to 32 bit float arrays --------- */
        this.vertices = new Float32Array(vertices.flat());
        this.colors = new Float32Array(colors.flat());

        /* --------- send data to buffers --------- */
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);
    }

    draw() {
        /* --------- set up attribute arrays --------- */
        Shape.setupAttribute(this.buffers.vertexBuffer, locations.attributes.vertexLocation);
        Shape.setupAttribute(this.buffers.colorBuffer, locations.attributes.colorLocation);

        /* --------- combine view and model matrix into modelView matrix --------- */
        const modelViewMatrix = mat4.create();
        mat4.mul(modelViewMatrix, viewMatrix, this.modelMatrix);

        /* --------- send modelView matrix to GPU --------- */
        gl.uniformMatrix4fv(locations.uniforms.modelViewMatrix, gl.FALSE, modelViewMatrix);

        /* --------- draw the shape --------- */
        gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 4);
    }

    rotate(angle, axis, global = false) {
        /**
         * The transformation functions that glMatrix provides apply the new transformation as the right hand operand,
         * which means the new transformation will be the first one to be applied (this will result in a local transformation)
         *
         * The function call below would look like this if you write down the matrices directly:
         * transformationMatrix * rotationMatrix
         */
        if (!global) {
            mat4.rotate(this.modelMatrix, this.modelMatrix, angle, axis);
        } else {
            /**
             * To get global transformations, you need to apply the new transformation after all the other transformations, i.e. as the left-most operand:
             * rotationMatrix * transformationMatrix
             * 
             * You can do this manually by construction the transformation matrix and then using mat4.multiply(out, leftOperand, rightOperand).
             */
            const rotationMatrix = mat4.create();
            mat4.rotate(rotationMatrix, rotationMatrix, angle, axis);
            mat4.mul(this.modelMatrix, rotationMatrix, this.modelMatrix)

        }
    }

    translate(vector) {
        mat4.translate(this.modelMatrix, this.modelMatrix, vector);
    }

    static setupAttribute(buffer, location) {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

        gl.vertexAttribPointer(
            location, // the attribute location
            4, // number of elements for each attribute/vertex
            gl.FLOAT, // type of the attributes
            gl.FALSE, // is data normalised?
            4 * Float32Array.BYTES_PER_ELEMENT, // size for one vertex
            0 // offset from begin of vertex to the attribute
        );

        // enable the attribute
        gl.enableVertexAttribArray(location);
    }
}
