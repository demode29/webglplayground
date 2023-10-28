import Mesh from "./Mesh";
const generateTetrahedron = () => {
  const mesh = new Mesh();

  const a = 1.0 / 3.0;
  const b = Math.sqrt(8.0 / 9.0);
  const c = Math.sqrt(2.0 / 9.0);
  const d = Math.sqrt(2.0 / 3.0);

  const v0 = [0, 0, 1];
  const v1 = [-c, d, -a];
  const v2 = [-c, -d, -a];
  const v3 = [b, 0, -a];

  const v0Indice = mesh.addVertex(v0);
  const v1Indice = mesh.addVertex(v1);
  const v2Indice = mesh.addVertex(v2);
  const v3Indice = mesh.addVertex(v3);

  mesh.addTriangle(v0Indice, v1Indice, v2Indice);
  mesh.addTriangle(v0Indice, v2Indice, v3Indice);
  mesh.addTriangle(v0Indice, v3Indice, v1Indice);
  mesh.addTriangle(v3Indice, v2Indice, v1Indice);
  const faceColors = [
    // each face has color
    [1.0, 0.0, 0.0, 1.0],
    [0.0, 1.0, 0.0, 1.0],
    [0.0, 0.0, 1.0, 1.0],
    [1.0, 1.0, 0.0, 1.0],
  ];

  const test = Mesh.prepareForShader(mesh, faceColors, false);

  return {
    vertices: test.shaderVertices,
    indices: test.shaderIndices,
    colors: test.shaderVertexColors,
    mesh,
  };
};

export { generateTetrahedron };
