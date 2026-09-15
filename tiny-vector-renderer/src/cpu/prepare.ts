import type { Color, PreparedTile, SourceTile } from "../tile/types";

/**
 * CPU / WASM side of the map.
 *
 * Input: features in tile space.
 * Output: typed arrays a GL buffer can swallow.
 *
 * This file is the candidate to move into Rust. It does not create a context,
 * compile a shader, or call draw. If it starts doing those things, the split
 * has already failed.
 */
export const prepareTile = (tile: SourceTile): PreparedTile => {
  const fillPositions: number[] = [];
  const fillColors: number[] = [];
  const linePositions: number[] = [];
  const lineColors: number[] = [];

  for (const fill of tile.fills) {
    appendFan(fill.ring, fill.color, fillPositions, fillColors);
  }

  for (const line of tile.lines) {
    appendPath(line.path, line.color, linePositions, lineColors);
  }

  return {
    extent: tile.extent,
    fillPositions: new Float32Array(fillPositions),
    fillColors: new Float32Array(fillColors),
    fillVertexCount: fillPositions.length / 2,
    linePositions: new Float32Array(linePositions),
    lineColors: new Float32Array(lineColors),
    lineVertexCount: linePositions.length / 2,
  };
};

/** Convex ring → triangle fan. Concave rings need a real tessellator (also CPU). */
const appendFan = (
  ring: number[],
  color: Color,
  positions: number[],
  colors: number[]
) => {
  const pointCount = ring.length / 2;
  if (pointCount < 3) {
    return;
  }

  const originX = ring[0];
  const originY = ring[1];

  for (let i = 1; i < pointCount - 1; i += 1) {
    pushVertex(positions, colors, originX, originY, color);
    pushVertex(positions, colors, ring[i * 2], ring[i * 2 + 1], color);
    pushVertex(
      positions,
      colors,
      ring[(i + 1) * 2],
      ring[(i + 1) * 2 + 1],
      color
    );
  }
};

const appendPath = (
  path: number[],
  color: Color,
  positions: number[],
  colors: number[]
) => {
  const pointCount = path.length / 2;
  for (let i = 0; i < pointCount - 1; i += 1) {
    pushVertex(positions, colors, path[i * 2], path[i * 2 + 1], color);
    pushVertex(
      positions,
      colors,
      path[(i + 1) * 2],
      path[(i + 1) * 2 + 1],
      color
    );
  }
};

const pushVertex = (
  positions: number[],
  colors: number[],
  x: number,
  y: number,
  color: Color
) => {
  positions.push(x, y);
  colors.push(color[0], color[1], color[2], color[3]);
};
