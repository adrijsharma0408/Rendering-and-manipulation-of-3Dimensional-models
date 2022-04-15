export class Shader {
    constructor(gl, vertexShaderSrc, fragmentShaderSrc) {
        this.gl = gl;
        this.vertexShaderSrc = vertexShaderSrc;
        this.fragmentShaderSrc = fragmentShaderSrc;
        this.program = this.link(this.compile(gl.VERTEX_SHADER, this.vertexShaderSrc), this.compile(gl.FRAGMENT_SHADER, this.fragmentShaderSrc));
        this.vertexAttributesBuffer = this.createBuffer();
        this.indexBuffer = this.createBuffer();
    }

    compile(type, shaderSrc) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, shaderSrc);
        this.gl.compileShader(shader);
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS))
            throw new Error(this.gl.getShaderInfoLog(shader));
        return shader;
    }

    link(vertexShader, fragmentShader) {
        const program = this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);
        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS))
            throw new Error(this.gl.getProgramInfoLog(program));
        this.gl.deleteShader(this.vertexShader);
        this.gl.deleteShader(this.fragmentShader);
        this.gl.deleteProgram(this.shaderProgram);
        return program;
    }

    attribute(attributeName) {
        return this.gl.getAttribLocation(this.program, attributeName);
    }

    uniform(uniformName) {
        return this.gl.getUniformLocation(this.program, uniformName);
    }

    use() {
        this.gl.useProgram(this.program);
    }

    setUniform4f(uniformName, vec4) {
        const uniformLocation = this.uniform(uniformName);
        this.gl.uniform4f(uniformLocation, vec4[0], vec4[1], vec4[2], vec4[3]);
    }

    setUniform3f(uniformName, vec3) {
        const uniformLocation = this.uniform(uniformName);
        this.gl.uniform4f(uniformLocation, vec3[0], vec3[1], vec3[2]);
    }

    setUniformMatrix4fv(uniformName, mat4) {
        const uniformLocation = this.uniform(uniformName);
        this.gl.uniformMatrix4fv(uniformLocation, false, mat4);
    }

    createBuffer() {
        const buffer = this.gl.createBuffer();
        if (!buffer)
            throw new Error("Buffer for vertex attributes could not be allocated");
        return buffer;
    }

    bindArrayBuffer(elementVertexBuffer, elementVertexData) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, elementVertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, elementVertexData, this.gl.DYNAMIC_DRAW);
    }

    bindIndexBuffer(elementIndexBuffer, elementIndexData) {
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, elementIndexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, elementIndexData, this.gl.DYNAMIC_DRAW);
    }

    fillAttributeData(attributeName, elementPerAttribute, stride, offset) {
        const attributeIndex = this.attribute(attributeName);
        this.gl.enableVertexAttribArray(attributeIndex);
        this.gl.vertexAttribPointer(attributeIndex, elementPerAttribute, this.gl.FLOAT, false, stride, offset);
    }

    drawArrays(numberOfElements) {
        this.gl.drawArrays(this.gl.TRIANGLES, 0, numberOfElements);
    }

    drawElements(numberOfElements) {
        this.gl.drawElements(this.gl.TRIANGLES, numberOfElements, this.gl.UNSIGNED_SHORT, 0);
    }
}