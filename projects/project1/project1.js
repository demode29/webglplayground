import Mesh from "../../utils/Mesh";
import MathUtil from "../../utils/MathUtil";
import Geometries from "../../utils/Geometries";
import initShaders from "../../utils/Common/initShaders";
import VertexBuffer from "../../utils/VertexBuffer";
import VertexArray from "../../utils/VertexArray";
import DrawCommand from "../../utils/DrawCommand";

const createTetrahedronCommand = (gl, tetrahedron, commandInfo) => {
  const program = initShaders(gl, "vertex-shader-2d", "fragment-shader-2d");
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  const colorAttributeLocation = gl.getAttribLocation(program, "a_color");
  // const texcoordLocation = gl.getAttribLocation(program, "a_texcoord");
  const matrixAttributeLocation = gl.getUniformLocation(program, "u_matrix");
  const positionBuffer = new VertexBuffer(
    gl,
    tetrahedron.vertices,
    gl.ARRAY_BUFFER,
    gl.STATIC_DRAW
  );
  const colorBuffer = new VertexBuffer(
    gl,
    tetrahedron.colors,
    gl.ARRAY_BUFFER,
    gl.STATIC_DRAW
  );

  const attributes = [
    {
      index: positionAttributeLocation,
      componentsPerAttribute: 3,
      componentDatatype: gl.FLOAT,
      normalize: false,
      strideInBytes: 0,
      offsetInBytes: 0,
      buffer: positionBuffer.vertexBuffer,
    },
    {
      index: colorAttributeLocation,
      componentsPerAttribute: 4,
      componentDatatype: gl.FLOAT,
      normalize: false,
      strideInBytes: 0,
      offsetInBytes: 0,
      buffer: colorBuffer.vertexBuffer,
    },
  ];

  const uniforms = [
    {
      index: matrixAttributeLocation,
      name: "u_matrix",
      set: (value) => {
        gl.uniformMatrix4fv(matrixAttributeLocation, false, value);
      },
    },
  ];

  const vertexArray = new VertexArray(gl, attributes);
  const newDrawCommand = new DrawCommand(
    program,
    vertexArray,
    commandInfo,
    uniforms
  );

  return newDrawCommand;
};

const createSphereCommand = () => {};

const createPlaneCommand = (gl, plane, commandInfo) => {
  const program = initShaders(gl, "vertex-shader-2d", "fragment-shader-2d");
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  const colorAttributeLocation = gl.getAttribLocation(program, "a_color");
  // const texcoordLocation = gl.getAttribLocation(program, "a_texcoord");
  const matrixAttributeLocation = gl.getUniformLocation(program, "u_matrix");
  const positionBuffer = new VertexBuffer(
    gl,
    plane.vertices,
    gl.ARRAY_BUFFER,
    gl.STATIC_DRAW
  );
  const colorBuffer = new VertexBuffer(
    gl,
    plane.colors,
    gl.ARRAY_BUFFER,
    gl.STATIC_DRAW
  );

  const attributes = [
    {
      index: positionAttributeLocation,
      componentsPerAttribute: 3,
      componentDatatype: gl.FLOAT,
      normalize: false,
      strideInBytes: 0,
      offsetInBytes: 0,
      buffer: positionBuffer.vertexBuffer,
    },
    {
      index: colorAttributeLocation,
      componentsPerAttribute: 4,
      componentDatatype: gl.FLOAT,
      normalize: false,
      strideInBytes: 0,
      offsetInBytes: 0,
      buffer: colorBuffer.vertexBuffer,
    },
  ];

  const uniforms = [
    {
      index: matrixAttributeLocation,
      name: "u_matrix",
      set: (value) => {
        gl.uniformMatrix4fv(matrixAttributeLocation, false, value);
      },
    },
  ];

  const vertexArray = new VertexArray(gl, attributes);
  const newDrawCommand = new DrawCommand(
    program,
    vertexArray,
    commandInfo,
    uniforms
  );

  return newDrawCommand;
};

const resizeCanvasToDisplaySize = (canvas) => {
  let isResized = false;
  if (canvas.width !== canvas.clientWidth) {
    canvas.width = canvas.clientWidth;
    isResized = true;
  }
  if (canvas.height !== canvas.clientHeight) {
    canvas.height = canvas.clientHeight;
    isResized = true;
  }

  return isResized;
};

const init = () => {
  const canvas = document.querySelector("#main_canvas");

  const currentRotationParams = {
    rotationX: 0.0,
    rotationY: 0.0,
    rotationZ: 0.0,
  };

  const currentTranslationParams = {
    translationX: 0.0,
    translationY: 0.0,
    translationZ: 0.0,
  };

  const currentScaleParams = {
    scaleX: 1.0,
    scaleY: 1.0,
    scaleZ: 1.0,
  };

  const commandList = [];

  const gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }

  const ext = gl.getExtension("ANGLE_instanced_arrays");
  if (!ext) {
    return alert("need ANGLE_instanced_arrays");
  }

  gl.drawArraysInstancedANGLE = (mode, first, count, primcount) => {
    ext.drawArraysInstancedANGLE(mode, first, count, primcount);
  };

  gl.vertexAttribDivisorANGLE = (index, divisor) => {
    ext.vertexAttribDivisorANGLE(index, divisor);
  };

  const vaoExt = gl.getExtension("OES_vertex_array_object");
  if (!vaoExt) {
    return alert("need vertex array object extension");
  }

  gl.createVertexArray = () => vaoExt.createVertexArrayOES();

  gl.bindVertexArray = (vao) => {
    vaoExt.bindVertexArrayOES(vao);
  };

  let aspectRatio = gl.canvas.width / gl.canvas.height;

  const tetrahedron = Geometries.generateTetrahedron();

  const tetrahedronCommandInfo = {
    primitiveType: gl.LINES,
    offset: 0,
    count: tetrahedron.vertices.length / 3,
  };
  const tetrahedronCommand = createTetrahedronCommand(
    gl,
    tetrahedron,
    tetrahedronCommandInfo
  );

  commandList.push(tetrahedronCommand);

  // generating plane
  const plane = Geometries.generatePlane(1.0, 1.0);

  const planeCommandInfo = {
    primitiveType: gl.TRIANGLES,
    offset: 0,
    count: plane.vertices.length / 3,
  };

  const planeCommand = createPlaneCommand(gl, plane, planeCommandInfo);

  commandList.push(planeCommand);

  // const boundingPoints = Mesh.calculateBoundingSphere(tetrahedron.mesh);

  // const tesselatedSphere = Geometries.tesellateTetrahedron(
  //   tetrahedron.mesh,
  //   3,
  //   {
  //     radius: boundingPoints.radius,
  //     center: boundingPoints.center,
  //   }
  // );

  // const tesselatedSphereCommandInfo = {
  //   primitiveType: gl.TRIANGLES,
  //   offset: 0,
  //   count: tesselatedSphere.vertices.length / 3,
  // };

  // const sphereCommand = createSphereCommand(
  //   gl,
  //   tesselatedSphere,
  //   tesselatedSphereCommandInfo
  // );

  // commandList.push(sphereCommand);

  const setFramebufferAttachmentSizes = (width, height) => {
    gl.bindTexture(gl.TEXTURE_2D, targetTexture);
    // define size and format of level 0
    const level = 0;
    const internalFormat = gl.RGBA;
    const border = 0;
    const format = gl.RGBA;
    const type = gl.UNSIGNED_BYTE;
    const data = null;
    gl.texImage2D(
      gl.TEXTURE_2D,
      level,
      internalFormat,
      width,
      height,
      border,
      format,
      type,
      data
    );

    gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
    gl.renderbufferStorage(
      gl.RENDERBUFFER,
      gl.DEPTH_COMPONENT16,
      width,
      height
    );
  };

  const render = () => {
    if (resizeCanvasToDisplaySize(gl.canvas)) {
      // setFramebufferAttachmentSizes(gl.canvas.width, gl.canvas.height);
    }
    const time = Date.now();
    aspectRatio = gl.canvas.width / gl.canvas.height;
    // webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.enable(gl.DEPTH_TEST);

    gl.enable(gl.CULL_FACE);
    let viewMatrix;

    const eulerRotationMatrix = MathUtil.createEulerRotationMatrix(
      currentRotationParams.rotationX,
      currentRotationParams.rotationY,
      currentRotationParams.rotationZ
    );

    const translationMatrix = MathUtil.createTranslationMatrix(
      currentTranslationParams.translationX,
      currentTranslationParams.translationY,
      currentTranslationParams.translationZ
    );

    const scaleMatrix = MathUtil.createScaleMatrix(
      currentScaleParams.scaleX,
      currentScaleParams.scaleY,
      currentScaleParams.scaleZ
    );

    // let viewMatrix = createOrtographicMatrix(-1.0, 1.0, -1.0, 1.0, -1.0, 1.0);

    // viewMatrix = multiplyMatrix(viewMatrix, translationMatrix);
    // viewMatrix = multiplyMatrix(viewMatrix, eulerRotationMatrix);
    // viewMatrix = multiplyMatrix(viewMatrix, scaleMatrix);
    // // // since we calculate in row major order we transpose before sending to shader
    // viewMatrix = transposeMatrix(viewMatrix);
    // gl.uniformMatrix4fv(tetrahedronProgramParameters.uniforms.projection, false, viewMatrix);

    // usePointProgram(gl, pointProgramParameters);

    // viewMatrix = createOrtographicMatrix(-1.0, 1.0, -1.0, 1.0, -1.0, 1.0);

    // viewMatrix = transposeMatrix(viewMatrix);

    // gl.uniformMatrix4fv(pointProgramParameters.uniforms.projection, false, viewMatrix);

    // gl.drawArrays(gl.POINTS, 0, pointProgramParameters.attributeValues.position.length / 3);

    // useSphereProgram(gl, sphereProgramParameters, useIndexedBuffer);

    viewMatrix = MathUtil.createOrtographicMatrix(
      -10.0 * aspectRatio,
      10.0 * aspectRatio,
      -10.0,
      10.0,
      -10.0,
      10.0
    );

    viewMatrix = MathUtil.multiplyMatrix(viewMatrix, translationMatrix);
    viewMatrix = MathUtil.multiplyMatrix(viewMatrix, eulerRotationMatrix);
    viewMatrix = MathUtil.multiplyMatrix(viewMatrix, scaleMatrix);

    viewMatrix = MathUtil.transposeMatrix(viewMatrix);

    // TODO: implement instancing for points

    // if (pointCounter > 0) {
    //   viewMatrix = createOrtographicMatrix(
    //     -10.0 * aspectRatio,
    //     10.0 * aspectRatio,
    //     -10.0,
    //     10.0,
    //     -10.0,
    //     10.0,
    //   );

    //   viewMatrix = transposeMatrix(viewMatrix);
    //   usePointProgram(gl, pointProgramParameters, ext);
    //   gl.uniformMatrix4fv(pointProgramParameters.uniforms.projection, false, viewMatrix);
    //   ext.drawArraysInstancedANGLE(
    //     gl.POINTS,
    //     0, // offset
    //     1.0, // num vertices per instance
    //     Math.floor(pointCounter / 2.0), // num instances
    //   );
    //   ext.vertexAttribDivisorANGLE(pointProgramParameters.attributes.translate, 0);
    // }
    commandList.forEach((command) => {
      command.execute(gl, {
        uniformMap: [
          {
            name: "u_matrix",
            value: viewMatrix,
          },
        ],
      });
    });
    // drawPoints.forEach((drawPointProgram) => {
    //   viewMatrix = createOrtographicMatrix(
    //     -10.0 * aspectRatio,
    //     10.0 * aspectRatio,
    //     -10.0,
    //     10.0,
    //     -10.0,
    //     10.0,
    //   );

    //   viewMatrix = transposeMatrix(viewMatrix);
    //   usePointProgram(gl, drawPointProgram);

    //   gl.uniformMatrix4fv(drawPointProgram.uniforms.projection, false, viewMatrix);

    //   gl.drawArrays(gl.POINTS, 0, drawPointProgram.attributeValues.position.length / 3);
    // });
    // gl.uniform1f(pointProgramParameters.attributes.uniforms.time, time);

    // draw points

    // gl.drawArrays(primitiveType, offset, drawCount);

    // requestAnimationFrame(render);
  };

  const addRotationListeners = () => {
    const rotationXInput = document.querySelector("#rotationX");
    const rotationYInput = document.querySelector("#rotationY");
    const rotationZInput = document.querySelector("#rotationZ");

    rotationXInput.addEventListener("input", (rotationXHTMLElement) => {
      currentRotationParams.rotationX = Number(
        rotationXHTMLElement.target.value
      );
      // console.log(currentRotationParams);
      render();
      //   render();
    });

    rotationYInput.addEventListener("input", (rotationYHTMLElement) => {
      currentRotationParams.rotationY = Number(
        rotationYHTMLElement.target.value
      );
      // console.log(currentRotationParams);
      render();
    });

    rotationZInput.addEventListener("input", (rotationZHTMLElement) => {
      currentRotationParams.rotationZ = Number(
        rotationZHTMLElement.target.value
      );
      // console.log(currentRotationParams);
      render();
    });
  };

  const addTranslationListeners = () => {
    const translationXInput = document.querySelector("#translationX");
    const translationYInput = document.querySelector("#translationY");
    const translationZInput = document.querySelector("#translationZ");

    translationXInput.addEventListener("input", (translationXHTMLElement) => {
      currentTranslationParams.translationX = Number(
        translationXHTMLElement.target.value
      );
      render();
      //   render();
    });

    translationYInput.addEventListener("input", (translationYHTMLElement) => {
      currentTranslationParams.translationY = Number(
        translationYHTMLElement.target.value
      );
      render();
    });

    translationZInput.addEventListener("input", (translationZHTMLElement) => {
      currentTranslationParams.translationZ = Number(
        translationZHTMLElement.target.value
      );
      render();
    });
  };

  const addScaleListeners = () => {
    const scaleXInput = document.querySelector("#scaleX");
    const scaleYInput = document.querySelector("#scaleY");
    const scaleZInput = document.querySelector("#scaleZ");

    scaleXInput.addEventListener("input", (scaleXHTMLElement) => {
      currentScaleParams.scaleX = Number(scaleXHTMLElement.target.value);
      render();
      //   render();
    });

    scaleYInput.addEventListener("input", (scaleYHTMLElement) => {
      currentScaleParams.scaleY = Number(scaleYHTMLElement.target.value);
      render();
    });

    scaleZInput.addEventListener("input", (scaleZHTMLElement) => {
      currentScaleParams.scaleZ = Number(scaleZHTMLElement.target.value);
      render();
    });
  };

  const addCameraController = () => {
    // wheel event
    const mainCanvas = gl.canvas;

    const zoom = () => {
      event.preventDefault();
    };

    // we will send ray from camera
    const createRay = (windowPosition) => {
      // from window position to ndc coordinates
      // ranges from 0 to 1
      const ndcX = (windowPosition.x / mainCanvas.width) * 2.0 - 1.0;
      const ndcY =
        ((mainCanvas.clientHeight - windowPosition.y) / mainCanvas.height) *
          2.0 -
        1.0;
      // for now assume that
      const ndcZ = -1.0;

      // const ndcCoordinates = [ndcX, ndcY, ndcZ];

      // console.log(ndcCoordinates);

      // const clipCoordinates = [10 * ndcX * aspectRatio, 10 * ndcY, 10 * ndcZ];
      // const viewMatrix = createOrtographicMatrix(
      //   -10.0 * aspectRatio,
      //   10.0 * aspectRatio,
      //   -10.0,
      //   10.0,
      //   -10.0,
      //   10.0,
      // );

      // inverse projection matrix
      // ndc coordinates to clip coordinates
      // const transposedViewMatrix = transposeMatrix(viewMatrix);
      // const inverseView = inverse4x4Matrix(viewMatrix);

      // ndc to clip coordinates
      // const clipCoordinates = multiplyMatrixAndPoint(inverseView, ndcCoordinates);

      // since our ray is sent to z axis infinity we can just check 2d collision with objects???

      // const pointCoordinates = new Float32Array(clipCoordinates.length);

      // drawPoints[pointCounter++] = clipCoordinates[0];
      // pointProgramParameters.attributeValues.translate[pointCounter++] = ndcX;
      // drawPoints[pointCounter++] = clipCoordinates[1];
      // pointProgramParameters.attributeValues.translate[pointCounter++] = ndcY;
      // TODO: if translate size grows than 1000 repreare array
      // pointProgramParameters.attributeValues.translate[pointCounter++] = clipCoordinates[2];
      // drawPoints[pointCounter++] = clipCoordinates[2];

      // console.log(pointCoordinates);

      // const pointProgramParameters = preparePointProgram(gl, pointCoordinates);
      // console.log(pointProgramParameters);
      // drawPoints.push(pointProgramParameters);
      // drawPoints.concat(pointCoordinates);

      // console.log(clipCoordinates);
    };

    // mainCanvas.addEventListener('wheel', () => {

    // });
    mainCanvas.addEventListener("click", (event) => {
      const boundRect = event.target.getBoundingClientRect();
      const mousePositionX = event.clientX - boundRect.left;
      const mousePositionY = event.clientY - boundRect.top;

      createRay({
        x: mousePositionX,
        y: mousePositionY,
      });
      // console.log(event);
      // console.log(mousePositionX);
      // console.log(mousePositionY);
      // pick object
    });
    // spin
  };

  addRotationListeners();
  addTranslationListeners();
  addScaleListeners();
  addCameraController();

  requestAnimationFrame(render);

  // one pass render
  // render();
};

init();
