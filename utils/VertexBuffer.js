export default class VertexBuffer {
  constructor(gl, values, bufferTarget, usage) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(bufferTarget, buffer);
    gl.bufferData(bufferTarget, values, usage);
    gl.bindBuffer(bufferTarget, null);

    this.vertexBuffer = buffer;
    this.bufferTarget = bufferTarget;
  }
}
