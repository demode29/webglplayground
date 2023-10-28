const createOrtographicMatrix = (left, right, bottom, top, near, far) => {
    const w = right - left;
    const h = top - bottom;
    const d = far - near;
  
    return [
      2.0 / w, 0.0, 0.0, -(left + right) / w,
      0.0, 2.0 / h, 0.0, -(top + bottom) / h,
      0.0, 0.0, -(near + far) / d, -2.0 / d,
      0.0, 0.0, 0.0, 1.0,
    ];
  };
  
  const determinant3x3 = (matrix) => {
    const det = matrix[0] * matrix[4] * matrix[8]
                + matrix[1] * matrix[5] * matrix[6]
                + matrix[2] * matrix[3] * matrix[7]
                - matrix[2] * matrix[4] * matrix[6]
                - matrix[1] * matrix[3] * matrix[8]
                - matrix[0] * matrix[5] * matrix[7];
  
    return det;
  };
  
  const indexer = (i, j) => (j - 1) + (i - 1) * 4;
  const determinant4x4 = (matrix) => {
    const a11 = matrix[indexer(1, 1)];
    const a21 = matrix[indexer(2, 1)];
    const a31 = matrix[indexer(3, 1)];
    const a41 = matrix[indexer(4, 1)];
  
    const det = a11 * determinant3x3(
      [matrix[indexer(2, 2)], matrix[indexer(2, 3)], matrix[indexer(2, 4)],
        matrix[indexer(3, 2)], matrix[indexer(3, 3)], matrix[indexer(3, 4)],
        matrix[indexer(4, 2)], matrix[indexer(4, 3)], matrix[indexer(4, 4)]],
    )
    - a21 * determinant3x3([matrix[indexer(1, 2)], matrix[indexer(1, 3)], matrix[indexer(1, 4)],
      matrix[indexer(3, 2)], matrix[indexer(3, 3)], matrix[indexer(3, 4)],
      matrix[indexer(4, 2)], matrix[indexer(4, 3)], matrix[indexer(4, 4)]])
    + a31 * determinant3x3([matrix[indexer(1, 2)], matrix[indexer(1, 3)], matrix[indexer(1, 4)],
      matrix[indexer(2, 2)], matrix[indexer(2, 3)], matrix[indexer(2, 4)],
      matrix[indexer(4, 2)], matrix[indexer(4, 3)], matrix[indexer(4, 4)]])
    - a41 * determinant3x3([matrix[indexer(1, 2)], matrix[indexer(1, 3)], matrix[indexer(1, 4)],
      matrix[indexer(2, 2)], matrix[indexer(2, 3)], matrix[indexer(2, 4)],
      matrix[indexer(3, 2)], matrix[indexer(3, 3)], matrix[indexer(3, 4)]]);
  
    return det;
  };
  
  const adjucate4x4 = (matrix, det) => {
    const result = [];
  
    result[0] = det * determinant3x3(
      matrix[indexer(2, 2)],
      matrix[indexer(2, 3)],
      matrix[indexer(2, 4)],
      matrix[indexer(3, 2)],
      matrix[indexer(3, 3)],
      matrix[indexer(3, 4)],
      matrix[indexer(4, 2)],
      matrix[indexer(4, 3)],
      matrix[indexer(4, 4)],
    );
    result[1] = det * -1 * determinant3x3(
      matrix[indexer(2, 1)],
      matrix[indexer(2, 3)],
      matrix[indexer(2, 4)],
      matrix[indexer(3, 1)],
      matrix[indexer(3, 3)],
      matrix[indexer(3, 4)],
      matrix[indexer(4, 1)],
      matrix[indexer(4, 3)],
      matrix[indexer(4, 1)],
    );
    result[2] = det * determinant3x3(
      matrix[indexer(2, 1)],
      matrix[indexer(2, 2)],
      matrix[indexer(2, 4)],
      matrix[indexer(3, 1)],
      matrix[indexer(3, 2)],
      matrix[indexer(3, 4)],
      matrix[indexer(4, 1)],
      matrix[indexer(4, 2)],
      matrix[indexer(4, 4)],
    );
    result[3] = det * -1 * determinant3x3(
      matrix[indexer(2, 1)],
      matrix[indexer(2, 2)],
      matrix[indexer(2, 3)],
      matrix[indexer(3, 1)],
      matrix[indexer(3, 2)],
      matrix[indexer(3, 3)],
      matrix[indexer(4, 1)],
      matrix[indexer(4, 2)],
      matrix[indexer(4, 3)],
    );
    result[4] = det * determinant3x3(
      matrix[indexer(1, 2)],
      matrix[indexer(1, 3)],
      matrix[indexer(1, 4)],
      matrix[indexer(3, 2)],
      matrix[indexer(3, 3)],
      matrix[indexer(3, 4)],
      matrix[indexer(4, 2)],
      matrix[indexer(4, 3)],
      matrix[indexer(4, 4)],
    );
    result[5] = det * -1 * determinant3x3(
      matrix[indexer(1, 1)],
      matrix[indexer(1, 3)],
      matrix[indexer(1, 4)],
      matrix[indexer(3, 1)],
      matrix[indexer(3, 3)],
      matrix[indexer(3, 4)],
      matrix[indexer(4, 1)],
      matrix[indexer(4, 3)],
      matrix[indexer(4, 4)],
    );
    result[6] = det * determinant3x3(
      matrix[indexer(1, 1)],
      matrix[indexer(1, 2)],
      matrix[indexer(1, 4)],
      matrix[indexer(3, 1)],
      matrix[indexer(3, 2)],
      matrix[indexer(3, 4)],
      matrix[indexer(4, 1)],
      matrix[indexer(4, 2)],
      matrix[indexer(4, 4)],
    );
    result[7] = det * -1 * determinant3x3(
      matrix[indexer(1, 1)],
      matrix[indexer(1, 2)],
      matrix[indexer(1, 3)],
      matrix[indexer(3, 1)],
      matrix[indexer(3, 2)],
      matrix[indexer(3, 3)],
      matrix[indexer(4, 1)],
      matrix[indexer(4, 2)],
      matrix[indexer(4, 3)],
    );
    result[8] = det * determinant3x3(
      matrix[indexer(1, 2)],
      matrix[indexer(1, 3)],
      matrix[indexer(1, 4)],
      matrix[indexer(2, 2)],
      matrix[indexer(2, 3)],
      matrix[indexer(2, 4)],
      matrix[indexer(4, 2)],
      matrix[indexer(4, 3)],
      matrix[indexer(4, 4)],
    );
    result[9] = det * -1 * determinant3x3(
      matrix[indexer(1, 1)],
      matrix[indexer(1, 3)],
      matrix[indexer(1, 4)],
      matrix[indexer(2, 1)],
      matrix[indexer(2, 3)],
      matrix[indexer(2, 4)],
      matrix[indexer(4, 1)],
      matrix[indexer(4, 3)],
      matrix[indexer(4, 4)],
    );
    result[10] = det * determinant3x3(
      matrix[indexer(1, 1)],
      matrix[indexer(1, 2)],
      matrix[indexer(1, 4)],
      matrix[indexer(2, 1)],
      matrix[indexer(2, 2)],
      matrix[indexer(2, 4)],
      matrix[indexer(4, 1)],
      matrix[indexer(4, 2)],
      matrix[indexer(4, 4)],
    );
    result[11] = det * -1 * determinant3x3(
      matrix[indexer(1, 1)],
      matrix[indexer(1, 2)],
      matrix[indexer(1, 3)],
      matrix[indexer(2, 1)],
      matrix[indexer(2, 2)],
      matrix[indexer(2, 3)],
      matrix[indexer(4, 1)],
      matrix[indexer(4, 2)],
      matrix[indexer(4, 3)],
    );
    result[12] = det * determinant3x3(
      matrix[indexer(1, 2)],
      matrix[indexer(1, 3)],
      matrix[indexer(1, 4)],
      matrix[indexer(2, 2)],
      matrix[indexer(2, 3)],
      matrix[indexer(2, 4)],
      matrix[indexer(3, 2)],
      matrix[indexer(3, 3)],
      matrix[indexer(3, 4)],
    );
    result[13] = det * -1 * determinant3x3(
      matrix[indexer(1, 1)],
      matrix[indexer(1, 3)],
      matrix[indexer(1, 4)],
      matrix[indexer(2, 1)],
      matrix[indexer(2, 3)],
      matrix[indexer(2, 4)],
      matrix[indexer(3, 1)],
      matrix[indexer(3, 3)],
      matrix[indexer(3, 4)],
    );
    result[14] = det * determinant3x3(
      matrix[indexer(1, 1)],
      matrix[indexer(1, 2)],
      matrix[indexer(1, 4)],
      matrix[indexer(2, 1)],
      matrix[indexer(2, 2)],
      matrix[indexer(2, 4)],
      matrix[indexer(3, 1)],
      matrix[indexer(3, 2)],
      matrix[indexer(3, 4)],
    );
  
    result[15] = det * -1 * determinant3x3(
      matrix[indexer(1, 1)],
      matrix[indexer(1, 2)],
      matrix[indexer(1, 3)],
      matrix[indexer(2, 1)],
      matrix[indexer(2, 2)],
      matrix[indexer(2, 3)],
      matrix[indexer(3, 1)],
      matrix[indexer(3, 2)],
      matrix[indexer(3, 4)],
    );
  
    return result;
  };
  
  const inverse4x4Matrix = (matrix) => {
    const det = determinant4x4(matrix);
  
    const result = adjucate4x4(matrix, det);
  
    return result;
  };
  
  const createPerspectiveMatrix = () => {
  
  };
  
  const degreeToRadians = (degree) => degree * (Math.PI / 180.0);
  
  const radiansToDegrees = (radians) => radians * (180.0 / Math.PI);
  
  const transposeMatrix = (matrix) => {
    const result = [];
    for (let i = 0; i < 16; i += 1) {
      const xIndex = i % 4;
      const yIndex = Math.floor(i / 4);
  
      const transposedX = yIndex;
      const transposedY = xIndex;
  
      const transposedArrayIndex = 4 * transposedY + transposedX;
      const arrayIndex = 4 * yIndex + xIndex;
  
      result[arrayIndex] = matrix[transposedArrayIndex];
    }
  
    return result;
  };
  
  const multiplyMatrix = (matrix1, matrix2) => {
    const result = [];
    for (let i = 0; i < 16; i += 4) {
      for (let j = 0; j < 4; j += 1) {
        let sum = 0.0;
        for (let k = 0; k < 4; k += 1) {
          sum += matrix1[i + k] * matrix2[k * 4 + j];
        }
        result[i + j] = sum;
      }
    }
  
    return result;
  };
  
  const createIdentity4x4Matrix = () => {
    const result = [];
    for (let i = 0; i < 16; i += 1) {
      if (i % 4 === Math.floor(i / 4)) {
        result.push(1.0);
      } else {
        result.push(0.0);
      }
    }
  
    return result;
  };
  
  const createTranslationMatrix = (tx, ty, tz) => [
    1.0, 0.0, 0.0, tx,
    0.0, 1.0, 0.0, ty,
    0.0, 0.0, 1.0, tz,
    0.0, 0.0, 0.0, 1.0,
  ];
  
  const createScaleMatrix = (sx, sy, sz) => [
    sx, 0.0, 0.0, 0.0,
    0.0, sy, 0.0, 0.0,
    0.0, 0.0, sz, 0.0,
    0.0, 0.0, 0.0, 1.0,
  ];
  
  // creates a euler rotation matrix with given rotation x, rotation y and rotation z
  const createEulerRotationMatrix = (rotationX, rotationY, rotationZ) => {
    // const viewMatrix = transposeMatrix(createOrtographicMatrix(-1.0, 1.0, -1.0, 1.0, -1.0, 1.0));
    // const viewMatrix = createOrtographicMatrix(-1.0, 1.0, -1.0, 1.0, -1.0, 1.0);
    const radiansX = degreeToRadians(rotationX);
    const radiansY = degreeToRadians(rotationY);
    const radiansZ = degreeToRadians(rotationZ);
  
    const rotationOnXYPlane = [
      Math.cos(radiansZ), -Math.sin(radiansZ), 0.0, 0.0,
      Math.sin(radiansZ), Math.cos(radiansZ), 0.0, 0.0,
      0.0, 0.0, 1.0, 0.0,
      0.0, 0.0, 0.0, 1.0,
    ];
  
    const rotationOnYZPlane = [
      Math.cos(radiansX), 0.0, Math.sin(radiansX), 0.0,
      0.0, 1.0, 0.0, 0.0,
      -Math.sin(radiansX), 0.0, Math.cos(radiansX), 0.0,
      0.0, 0.0, 0.0, 1.0,
    ];
  
    const rotationOnZXPlane = [
      1.0, 0.0, 0, 0.0,
      0.0, Math.cos(radiansY), -Math.sin(radiansY), 0.0,
      0.0, Math.sin(radiansY), Math.cos(radiansY), 0.0,
      0.0, 0.0, 0.0, 1.0,
    ];
  
    let resultMatrix = createIdentity4x4Matrix();
  
    // const translateMatrix = createTranslationMatrix(0.1, );
  
    // resultMatrix = multiplyMatrix(resultMatrix, viewMatrix);
    resultMatrix = multiplyMatrix(resultMatrix, rotationOnYZPlane);
    resultMatrix = multiplyMatrix(resultMatrix, rotationOnZXPlane);
    resultMatrix = multiplyMatrix(resultMatrix, rotationOnXYPlane);
  
    // order first rotate in xy plane
    // second rotate in zx plane
    // third rotate in yz plane
    return resultMatrix;
};

const multiplyMatrixAndPoint = (matrix1, point1) => {
  // eslint-disable-next-line no-param-reassign
  const testResult = [point1[0], point1[1], point1[2], 1.0];
  let result = [];
  for (let i = 0; i < 16; i += 4) {
    let sum = 0.0;
    for (let j = 0; j < testResult.length; j += 1) {
      sum += matrix1[i + j] * testResult[j];
    }
    result[Math.floor(i / 4)] = sum;
  }

  result = [result[0], result[1], result[2]];

  return result;
};

const distanceBetweenPoints = (point1, point2) => {
  const xDif = point2[0] - point1[0];
  const yDif = point2[1] - point1[1];
  const zDif = point2[2] - point1[2];

  return Math.sqrt(xDif * xDif + yDif * yDif + zDif * zDif);
};

const calculateMidPoint = (point1, point2) => {
  const xCenter = (point2[0] + point1[0]) * 0.5;
  const yCenter = (point2[1] + point1[1]) * 0.5;
  const zCenter = (point2[2] + point1[2]) * 0.5;

  return [
    xCenter,
    yCenter,
    zCenter,
  ];
};

const multiplyPointByScalar = (point, scalar) => [point[0] * scalar,
  point[1] * scalar, point[2] * scalar];

const normalizeVector = (point1) => {
  const x = point1[0];
  const y = point1[1];
  const z = point1[2];

  const a = Math.sqrt(x * x + y * y + z * z);
  const xNormalized = x / a;
  const yNormalized = y / a;
  const zNormalized = z / a;

  return [
    xNormalized,
    yNormalized,
    zNormalized,
  ];
};


export {
  createOrtographicMatrix,
  normalizeVector,
  degreeToRadians,
  distanceBetweenPoints,
  multiplyPointByScalar,
  multiplyMatrixAndPoint,
  createTranslationMatrix,
  createScaleMatrix,
  createIdentity4x4Matrix,
  createPerspectiveMatrix,
  createEulerRotationMatrix,
  calculateMidPoint,
  multiplyMatrix,
  inverse4x4Matrix,
  transposeMatrix
};