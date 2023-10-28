export default class VertexArray {
  constructor(gl, attributes, additionals) {
    this.vao = gl.createVertexArray();
    this.additionals = additionals;
    if (this.additionals === undefined) {
      this.additionals = {
        indexBuffer: undefined,
      };
    }
    this.indexBuffer = additionals.indexBuffer;
    this.gl = gl;

    gl.bindVertexArray(this.vao);
    attributes.forEach((attribute) => {
      gl.enableVertexAttribArray(attribute.index);

      gl.bindBuffer(gl.ARRAY_BUFFER, attribute.buffer);

      gl.vertexAttribPointer(
        attribute.index,
        attribute.componentsPerAttribute,
        attribute.componentDatatype,
        attribute.normalize,
        attribute.strideInBytes,
        attribute.offsetInBytes
      );
      if (attribute.instanceDivisor && attribute.instanceDivisor > 0) {
        gl.vertexAttribDivisorANGLE(attribute.index, attribute.instanceDivisor);
      }
    });

    if (this.indexBuffer !== undefined) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer.buffer);
    }
  }

  bind() {
    this.gl.bindVertexArray(this.vao);
  }

  unbind() {
    this.gl.bindVertexArray(null);
  }
}
