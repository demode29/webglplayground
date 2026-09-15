import type { PreparedTile } from "../tile/types";

const FILL_VERT = `#version 300 es
in vec2 a_pos;
in vec4 a_color;
uniform float u_extent;
out vec4 v_color;
void main() {
  vec2 zeroToOne = a_pos / u_extent;
  vec2 clip = zeroToOne * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
  v_color = a_color;
}
`;

const FILL_FRAG = `#version 300 es
precision mediump float;
in vec4 v_color;
out vec4 outColor;
void main() {
  outColor = v_color;
}
`;

type ProgramSet = {
  program: WebGLProgram;
  pos: number;
  color: number;
  extent: WebGLUniformLocation;
};

/**
 * GPU side of the map. It is allowed to bind buffers and draw.
 * It is not allowed to know what a vector tile is.
 */
export const paintTile = (gl: WebGL2RenderingContext, tile: PreparedTile) => {
  const fill = compile(gl, FILL_VERT, FILL_FRAG);
  const line = fill;

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0.91, 0.89, 0.84, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.lineWidth(2);

  draw(gl, fill, tile.fillPositions, tile.fillColors, tile.extent, gl.TRIANGLES);
  draw(gl, line, tile.linePositions, tile.lineColors, tile.extent, gl.LINES);
};

const draw = (
  gl: WebGL2RenderingContext,
  prog: ProgramSet,
  positions: Float32Array,
  colors: Float32Array,
  extent: number,
  mode: number
) => {
  if (positions.length === 0) {
    return;
  }

  gl.useProgram(prog.program);
  gl.uniform1f(prog.extent, extent);

  bindAttribute(gl, prog.pos, positions, 2);
  bindAttribute(gl, prog.color, colors, 4);
  gl.drawArrays(mode, 0, positions.length / 2);
};

const bindAttribute = (
  gl: WebGL2RenderingContext,
  index: number,
  data: Float32Array,
  size: number
) => {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(index);
  gl.vertexAttribPointer(index, size, gl.FLOAT, false, 0, 0);
};

const compile = (
  gl: WebGL2RenderingContext,
  vertSrc: string,
  fragSrc: string
): ProgramSet => {
  const program = gl.createProgram();
  if (!program) {
    throw new Error("Could not create program");
  }

  gl.attachShader(program, shader(gl, gl.VERTEX_SHADER, vertSrc));
  gl.attachShader(program, shader(gl, gl.FRAGMENT_SHADER, fragSrc));
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) ?? "link failed");
  }

  const extent = gl.getUniformLocation(program, "u_extent");
  if (!extent) {
    throw new Error("u_extent missing");
  }

  return {
    program,
    pos: gl.getAttribLocation(program, "a_pos"),
    color: gl.getAttribLocation(program, "a_color"),
    extent,
  };
};

const shader = (
  gl: WebGL2RenderingContext,
  type: number,
  source: string
): WebGLShader => {
  const compiled = gl.createShader(type);
  if (!compiled) {
    throw new Error("Could not create shader");
  }
  gl.shaderSource(compiled, source);
  gl.compileShader(compiled);
  if (!gl.getShaderParameter(compiled, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(compiled) ?? "compile failed");
  }
  return compiled;
};
