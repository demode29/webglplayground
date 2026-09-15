export type DrawList = {
  triangles?: { positions: number[]; colors: number[] };
  lines?: { positions: number[]; colors: number[] };
  points?: { positions: number[]; colors: number[]; size?: number };
};

const VERT = `#version 300 es
in vec3 a_pos;
in vec4 a_color;
uniform mat4 u_mvp;
uniform float u_pointSize;
out vec4 v_color;
void main() {
  gl_Position = u_mvp * vec4(a_pos, 1.0);
  gl_PointSize = u_pointSize;
  v_color = a_color;
}
`;

const FRAG = `#version 300 es
precision mediump float;
in vec4 v_color;
out vec4 outColor;
void main() {
  outColor = v_color;
}
`;

export const createDrawer = (canvas: HTMLCanvasElement) => {
  const gl = canvas.getContext("webgl2", { antialias: true });
  if (!gl) {
    throw new Error("WebGL2 is required");
  }

  const program = link(gl, VERT, FRAG);
  const pos = gl.getAttribLocation(program, "a_pos");
  const color = gl.getAttribLocation(program, "a_color");
  const mvpLoc = gl.getUniformLocation(program, "u_mvp");
  const pointSizeLoc = gl.getUniformLocation(program, "u_pointSize");
  const vao = gl.createVertexArray();

  const resize = () => {
    const width = canvas.clientWidth * devicePixelRatio;
    const height = canvas.clientHeight * devicePixelRatio;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
  };

  const draw = (mvp: Float32Array, list: DrawList, clear: [number, number, number, number]) => {
    resize();
    gl.bindVertexArray(vao);
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(clear[0], clear[1], clear[2], clear[3]);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(program);
    gl.uniformMatrix4fv(mvpLoc, false, mvp);

    if (list.triangles) {
      bind(gl, pos, color, list.triangles.positions, list.triangles.colors, 3);
      gl.drawArrays(gl.TRIANGLES, 0, list.triangles.positions.length / 3);
    }
    if (list.lines) {
      bind(gl, pos, color, list.lines.positions, list.lines.colors, 3);
      gl.drawArrays(gl.LINES, 0, list.lines.positions.length / 3);
    }
    if (list.points) {
      gl.uniform1f(pointSizeLoc, list.points.size ?? 10);
      bind(gl, pos, color, list.points.positions, list.points.colors, 3);
      gl.drawArrays(gl.POINTS, 0, list.points.positions.length / 3);
    }
  };

  return { gl, draw, resize };
};

const bind = (
  gl: WebGL2RenderingContext,
  pos: number,
  color: number,
  positions: number[],
  colors: number[],
  size: number
) => {
  const p = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, p);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STREAM_DRAW);
  gl.enableVertexAttribArray(pos);
  gl.vertexAttribPointer(pos, size, gl.FLOAT, false, 0, 0);

  const c = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, c);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STREAM_DRAW);
  gl.enableVertexAttribArray(color);
  gl.vertexAttribPointer(color, 4, gl.FLOAT, false, 0, 0);
};

const link = (gl: WebGL2RenderingContext, vert: string, frag: string) => {
  const program = gl.createProgram();
  if (!program) {
    throw new Error("program");
  }
  gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, vert));
  gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, frag));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) ?? "link");
  }
  return program;
};

const compile = (gl: WebGL2RenderingContext, type: number, src: string) => {
  const shader = gl.createShader(type);
  if (!shader) {
    throw new Error("shader");
  }
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) ?? "compile");
  }
  return shader;
};
