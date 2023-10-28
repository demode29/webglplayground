export default class DrawCommand {
  constructor(shaderProgram, vao, commandInfo, uniforms) {
    this.shaderProgram = shaderProgram;
    this.vao = vao;
    this.uniforms = uniforms;
    this.instanced = commandInfo.instanced;
    this.hasIndexBuffer = commandInfo.hasIndexBuffer;
    this.indexType = commandInfo.indexType;
    this.count = commandInfo.count;
    this.primitiveType = commandInfo.primitiveType;
    this.offset = commandInfo.offset;
    this.instanceCount = commandInfo.instanceCount;
    this.verticePerInstance = commandInfo.verticeNumberPerInstance;
  }

  execute(gl, overrides) {
    gl.useProgram(this.shaderProgram);

    const uniformMap = overrides.uniformMap;

    this.uniforms.forEach((uniform) => {
      const overridenUniformIndex = uniformMap.findIndex(
        (overridenUniform) => overridenUniform.name === uniform.name
      );
      if (overridenUniformIndex !== -1) {
        uniform.set(uniformMap[overridenUniformIndex].value);
      }
    });

    this.vao.bind();
    if (this.hasIndexBuffer) {
      gl.drawElements(
        this.primitiveType,
        this.count,
        this.indexType,
        this.offset
      );
    } else if (this.instanced) {
      gl.drawArraysInstancedANGLE(
        this.primitiveType,
        this.offset, // offset
        this.verticePerInstance, // num vertices per instance
        this.instanceCount // num instances
      );
    } else {
      gl.drawArrays(this.primitiveType, this.offset, this.count);
    }
    // then unbind
    this.vao.unbind();

    gl.useProgram(null);
  }
}
