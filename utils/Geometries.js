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

const recursivelySubdivide = (
  currentVertices,
  currentStep,
  meshResult,
  scalar,
  translater
) => {
  if (currentStep === 0) {
    return;
  }
  const vertex0 = currentVertices[0];
  const vertex1 = currentVertices[1];
  const vertex2 = currentVertices[2];

  const reverseTranslater = createTranslationMatrix(
    -translater[3],
    -translater[7],
    -translater[11]
  );
  const reverseScalar = createScaleMatrix(
    1 / scalar[0],
    1 / scalar[5],
    1 / scalar[10]
  );

  const reversedTranslatedVertex0 = multiplyMatrixAndPoint(
    reverseTranslater,
    vertex0
  );
  const reversedVertex0 = multiplyMatrixAndPoint(
    reverseScalar,
    reversedTranslatedVertex0
  );

  const reversedTranslatedVertex1 = multiplyMatrixAndPoint(
    reverseTranslater,
    vertex1
  );
  const reversedVertex1 = multiplyMatrixAndPoint(
    reverseScalar,
    reversedTranslatedVertex1
  );

  const reversedTranslatedVertex2 = multiplyMatrixAndPoint(
    reverseTranslater,
    vertex2
  );
  const reversedVertex2 = multiplyMatrixAndPoint(
    reverseScalar,
    reversedTranslatedVertex2
  );

  const midPoint0 = normalizeVector(
    calculateMidPoint(reversedVertex0, reversedVertex1)
  );

  const midPoint1 = normalizeVector(
    calculateMidPoint(reversedVertex1, reversedVertex2)
  );

  const midPoint2 = normalizeVector(
    calculateMidPoint(reversedVertex0, reversedVertex2)
  );

  const scaledMidPoint0 = multiplyMatrixAndPoint(scalar, midPoint0);
  const translatedMidPoint0 = multiplyMatrixAndPoint(
    translater,
    scaledMidPoint0
  );
  const scaledMidPoint1 = multiplyMatrixAndPoint(scalar, midPoint1);
  const translatedMidPoint1 = multiplyMatrixAndPoint(
    translater,
    scaledMidPoint1
  );
  const scaledMidPoint2 = multiplyMatrixAndPoint(scalar, midPoint2);
  const translatedMidPoint2 = multiplyMatrixAndPoint(
    translater,
    scaledMidPoint2
  );

  const triangleO = [vertex0, translatedMidPoint0, translatedMidPoint2];
  const triangle1 = [
    translatedMidPoint0,
    translatedMidPoint1,
    translatedMidPoint2,
  ];
  const triangle2 = [translatedMidPoint2, translatedMidPoint1, vertex2];
  const triangle3 = [translatedMidPoint0, vertex1, translatedMidPoint1];

  if (currentStep - 1 === 0) {
    const v0Indice = meshResult.addVertex(vertex0);
    const v1Indice = meshResult.addVertex(vertex1);
    const v2Indice = meshResult.addVertex(vertex2);
    const midPoint0Indice = meshResult.addVertex(translatedMidPoint0);
    const midPoint1Indice = meshResult.addVertex(translatedMidPoint1);
    const midPoint2Indice = meshResult.addVertex(translatedMidPoint2);

    // triangle zero
    // result.push(vertex0);
    // result.push(midPoint0);
    // result.push(midPoint2);
    meshResult.addTriangle(v0Indice, midPoint0Indice, midPoint2Indice);

    // triangle one
    // result.push(midPoint0);
    // result.push(midPoint1);
    // result.push(midPoint2);
    meshResult.addTriangle(midPoint0Indice, midPoint1Indice, midPoint2Indice);

    // triangle two
    // result.push(midPoint2);
    // result.push(midPoint1);
    // result.push(vertex2);

    meshResult.addTriangle(midPoint2Indice, midPoint1Indice, v2Indice);

    // triangle three
    // result.push(vertex0);
    // result.push(vertex1);
    // result.push(midPoint1);

    meshResult.addTriangle(midPoint0Indice, v1Indice, midPoint1Indice);
    return;
  }

  // first triangle
  recursivelySubdivide(
    triangleO,
    currentStep - 1,
    meshResult,
    scalar,
    translater
  );
  recursivelySubdivide(
    triangle1,
    currentStep - 1,
    meshResult,
    scalar,
    translater
  );
  recursivelySubdivide(
    triangle2,
    currentStep - 1,
    meshResult,
    scalar,
    translater
  );
  recursivelySubdivide(
    triangle3,
    currentStep - 1,
    meshResult,
    scalar,
    translater
  );
};

// tessellates tetrahedron to sphere
const tesellateTetrahedron = (tetrahedron, step, info) => {
  // subdivide triangles and repeatedly normalize values to unit sphere
  const tetrahedronMesh = tetrahedron;
  const { vertices, faces } = tetrahedronMesh;

  const resultMesh = new Mesh();
  const { radius, center } = info;
  const translater = createTranslationMatrix(center[0], center[1], center[2]);
  const scaler = createScaleMatrix(radius, radius, radius);

  faces.forEach((face) => {
    const verticeIndex0 = face[0];
    const verticeIndex1 = face[1];
    const verticeIndex2 = face[2];

    const vertice0 = vertices[verticeIndex0];
    const vertice1 = vertices[verticeIndex1];
    const vertice2 = vertices[verticeIndex2];

    const scaledPoint0 = multiplyMatrixAndPoint(scaler, vertice0);
    const translatedPoint0 = multiplyMatrixAndPoint(translater, scaledPoint0);
    const scaledPoint1 = multiplyMatrixAndPoint(scaler, vertice1);
    const translatedPoint1 = multiplyMatrixAndPoint(translater, scaledPoint1);
    const scaledPoint2 = multiplyMatrixAndPoint(scaler, vertice2);
    const translatedPoint2 = multiplyMatrixAndPoint(translater, scaledPoint2);

    const triangle1 = [translatedPoint0, translatedPoint1, translatedPoint2];
    recursivelySubdivide(triangle1, step, resultMesh, scaler, translater);
  });
  // console.log(resultMesh);
  const faceColors = [
    // each face has color
    [1.0, 0.0, 0.0, 1.0],
    [0.0, 1.0, 0.0, 1.0],
    [0.0, 0.0, 1.0, 1.0],
    [1.0, 1.0, 0.0, 1.0],
  ];

  const tesselatedSphere = Mesh.prepareForShader(resultMesh, faceColors, false);

  return {
    vertices: tesselatedSphere.shaderVertices,
    indices: tesselatedSphere.shaderIndices,
    colors: tesselatedSphere.shaderVertexColors,
    tesselatedSphere,
  };
};

export default { generateTetrahedron, tesellateTetrahedron };
