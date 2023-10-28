const init = () => {
    const canvas = document.querySelector('#main_canvas');
  
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
  
    const gl = canvas.getContext('webgl');
    if (!gl) {
      return;
    }
  
    const ext = gl.getExtension('ANGLE_instanced_arrays');
    if (!ext) {
      return alert('need ANGLE_instanced_arrays');
    }
  
    gl.drawArraysInstancedANGLE = (mode, first, count, primcount) => {
      ext.drawArraysInstancedANGLE(mode, first, count, primcount);
    };
  
    gl.vertexAttribDivisorANGLE = (index, divisor) => {
      ext.vertexAttribDivisorANGLE(index, divisor);
    };
  
    const vaoExt = gl.getExtension('OES_vertex_array_object');
    if (!vaoExt) {
      return alert('need vertex array object extension');
    }
  
    gl.createVertexArray = () => vaoExt.createVertexArrayOES();
  
    gl.bindVertexArray = (vao) => {
      vaoExt.bindVertexArrayOES(vao);
    };
  
    let aspectRatio = gl.canvas.width / gl.canvas.height;
  
    const tetrahedron = generateTetrahedron();
  
    const tetrahedronCommandInfo = {
      primitiveType: gl.LINES,
      offset: 0,
      count: tetrahedron.vertices.length / 3,
    };
    const tetrahedronCommand = createTetrahedronCommand(gl, tetrahedron, tetrahedronCommandInfo);
  
    commandList.push(tetrahedronCommand);
  
    const boundingPoints = Mesh.calculateBoundingSphere(tetrahedron.mesh);
  
    const tesselatedSphere = tesellateTetrahedron(tetrahedron.mesh, 3, {
      radius: boundingPoints.radius,
      center: boundingPoints.center,
    });
  
    const tesselatedSphereCommandInfo = {
      primitiveType: gl.TRIANGLES,
      offset: 0,
      count: tesselatedSphere.vertices.length / 3,
    };
  
    const sphereCommand = createSphereCommand(gl, tesselatedSphere, tesselatedSphereCommandInfo);
  
    commandList.push(sphereCommand);
  
    // offset
    //     1.0, // num vertices per instance
    //     Math.floor(pointCounter / 2.0), // num instances
    const points = generatePoints();
    const pointCounter = 0;
    const instancedPointCommand = {
      primitiveType: gl.POINTS,
      offset: 0,
      instanceCount: Math.floor(pointCounter / 2.0),
      instanced: true,
      verticePerInstance: 1.0,
    };
  
    // just create command but do not push to command list since we will render point when user requests it
    const pointCommand = createPointCommand(gl, points, instancedPointCommand);
  
    // loadTexture(gl);
    // const useIndexedBuffer = false;
    // const pointArray = new Float32Array(3);
    // pointArray[0] = 0.0;
    // pointArray[1] = 0.0;
    // pointArray[2] = -1.0;
    // const translatePoints = new Float32Array(10000);
    // let pointCounter = 0;
  
    // const pointProgramParameters = preparePointProgram(gl, pointArray, translatePoints);
  
    // create a scene texture
    // const targetTexture = gl.createTexture();
    // gl.bindTexture(gl.TEXTURE_2D, targetTexture);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  
    // // create a depth renderbuffer
    // const depthBuffer = gl.createRenderbuffer();
    // gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
  
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
        data,
      );
  
      gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
      gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
    };
    // Create and bind the framebuffer
    // const fb = gl.createFramebuffer();
    // gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  
    // attach the texture as the first color attachment
    // const attachmentPoint = gl.COLOR_ATTACHMENT0;
    // const level = 0;
    // gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, targetTexture, level);
  
    // make a depth buffer and the same size as the targetTexture
    // gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);
  
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
  
      const eulerRotationMatrix = createEulerRotationMatrix(
        currentRotationParams.rotationX,
        currentRotationParams.rotationY,
        currentRotationParams.rotationZ,
      );
  
      const translationMatrix = createTranslationMatrix(
        currentTranslationParams.translationX,
        currentTranslationParams.translationY,
        currentTranslationParams.translationZ,
      );
  
      const scaleMatrix = createScaleMatrix(
        currentScaleParams.scaleX,
        currentScaleParams.scaleY,
        currentScaleParams.scaleZ,
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
  
      viewMatrix = createOrtographicMatrix(
        -10.0 * aspectRatio,
        10.0 * aspectRatio,
        -10.0,
        10.0,
        -10.0,
        10.0,
      );
  
      viewMatrix = multiplyMatrix(viewMatrix, translationMatrix);
      viewMatrix = multiplyMatrix(viewMatrix, eulerRotationMatrix);
      viewMatrix = multiplyMatrix(viewMatrix, scaleMatrix);
  
      viewMatrix = transposeMatrix(viewMatrix);
  
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
          uniformMap: [{
            name: 'u_matrix',
            value: viewMatrix,
          }],
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
      const rotationXInput = document.querySelector('#rotationX');
      const rotationYInput = document.querySelector('#rotationY');
      const rotationZInput = document.querySelector('#rotationZ');
  
      rotationXInput.addEventListener('input', (rotationXHTMLElement) => {
        currentRotationParams.rotationX = Number(rotationXHTMLElement.target.value);
        // console.log(currentRotationParams);
        render();
      //   render();
      });
  
      rotationYInput.addEventListener('input', (rotationYHTMLElement) => {
        currentRotationParams.rotationY = Number(rotationYHTMLElement.target.value);
        // console.log(currentRotationParams);
        render();
      });
  
      rotationZInput.addEventListener('input', (rotationZHTMLElement) => {
        currentRotationParams.rotationZ = Number(rotationZHTMLElement.target.value);
        // console.log(currentRotationParams);
        render();
      });
    };
  
    const addTranslationListeners = () => {
      const translationXInput = document.querySelector('#translationX');
      const translationYInput = document.querySelector('#translationY');
      const translationZInput = document.querySelector('#translationZ');
  
      translationXInput.addEventListener('input', (translationXHTMLElement) => {
        currentTranslationParams.translationX = Number(translationXHTMLElement.target.value);
        render();
      //   render();
      });
  
      translationYInput.addEventListener('input', (translationYHTMLElement) => {
        currentTranslationParams.translationY = Number(translationYHTMLElement.target.value);
        render();
      });
  
      translationZInput.addEventListener('input', (translationZHTMLElement) => {
        currentTranslationParams.translationZ = Number(translationZHTMLElement.target.value);
        render();
      });
    };
  
    const addScaleListeners = () => {
      const scaleXInput = document.querySelector('#scaleX');
      const scaleYInput = document.querySelector('#scaleY');
      const scaleZInput = document.querySelector('#scaleZ');
  
      scaleXInput.addEventListener('input', (scaleXHTMLElement) => {
        currentScaleParams.scaleX = Number(scaleXHTMLElement.target.value);
        render();
      //   render();
      });
  
      scaleYInput.addEventListener('input', (scaleYHTMLElement) => {
        currentScaleParams.scaleY = Number(scaleYHTMLElement.target.value);
        render();
      });
  
      scaleZInput.addEventListener('input', (scaleZHTMLElement) => {
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
        const ndcY = ((mainCanvas.clientHeight - windowPosition.y) / mainCanvas.height)
        * 2.0 - 1.0;
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
        pointProgramParameters.attributeValues.translate[pointCounter++] = ndcX;
        // drawPoints[pointCounter++] = clipCoordinates[1];
        pointProgramParameters.attributeValues.translate[pointCounter++] = ndcY;
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
      mainCanvas.addEventListener('click', (event) => {
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