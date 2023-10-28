export default class Mesh {
  constructor() {
    this.vertices = [];
    this.faces = [];
  }

  addVertex(v) {
    const vertexIndice = this.vertices.length;
    this.vertices.push(v);
    return vertexIndice;
  }

  addTriangle(v0index, v1index, v2index) {
    const faceIndice = this.faces.length;
    this.faces.push([v0index, v1index, v2index]);
    return faceIndice;
  }

  static prepareForShader(mesh, colors, useIndexedBuffer) {
    const { vertices } = mesh;
    const { faces } = mesh;

    const shaderVertices = new Float32Array(
      useIndexedBuffer ? vertices.length * 3 : 3 * 3 * faces.length
    );
    const shaderVertexColors = new Float32Array(3 * 4 * faces.length);
    const shaderIndices = new Uint16Array(faces.length * 3);

    const hasColors = colors !== undefined && colors.length > 0;

    let counter = 0;
    if (useIndexedBuffer) {
      vertices.forEach((vertice) => {
        shaderVertices[counter++] = vertice[0];
        shaderVertices[counter++] = vertice[1];
        shaderVertices[counter++] = vertice[2];
      });
      counter = 0;
      faces.forEach((face) => {
        shaderIndices[counter++] = face[0];
        shaderIndices[counter++] = face[1];
        shaderIndices[counter++] = face[2];
      });
    } else {
      let colorCounter = 0;
      faces.forEach((face, index) => {
        if (hasColors) {
          const faceColor = colors[index % colors.length];
          shaderVertexColors[colorCounter++] = faceColor[0];
          shaderVertexColors[colorCounter++] = faceColor[1];
          shaderVertexColors[colorCounter++] = faceColor[2];
          shaderVertexColors[colorCounter++] = faceColor[3];

          shaderVertexColors[colorCounter++] = faceColor[0];
          shaderVertexColors[colorCounter++] = faceColor[1];
          shaderVertexColors[colorCounter++] = faceColor[2];
          shaderVertexColors[colorCounter++] = faceColor[3];

          shaderVertexColors[colorCounter++] = faceColor[0];
          shaderVertexColors[colorCounter++] = faceColor[1];
          shaderVertexColors[colorCounter++] = faceColor[2];
          shaderVertexColors[colorCounter++] = faceColor[3];
        }
        const vertex1Index = face[0];
        const vertex2Index = face[1];
        const vertex3Index = face[2];

        const vertex1 = vertices[vertex1Index];
        const vertex2 = vertices[vertex2Index];
        const vertex3 = vertices[vertex3Index];

        shaderVertices[counter++] = vertex1[0];
        shaderVertices[counter++] = vertex1[1];
        shaderVertices[counter++] = vertex1[2];

        shaderVertices[counter++] = vertex2[0];
        shaderVertices[counter++] = vertex2[1];
        shaderVertices[counter++] = vertex2[2];

        shaderVertices[counter++] = vertex3[0];
        shaderVertices[counter++] = vertex3[1];
        shaderVertices[counter++] = vertex3[2];
      });
    }

    return {
      shaderVertices,
      shaderIndices,
      shaderVertexColors,
    };
  }

  static flatten(arrayOfVertices) {
    const flattenedArray = [];

    let counter = 0;
    arrayOfVertices.forEach((vertice) => {
      flattenedArray[counter++] = vertice[0];
      flattenedArray[counter++] = vertice[1];
      flattenedArray[counter++] = vertice[2];
    });

    return flattenedArray;
  }
}
