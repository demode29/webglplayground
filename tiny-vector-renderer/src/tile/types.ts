/** Tile space, same idea as MVT: integer extent, y growing down. */

export type Color = readonly [number, number, number, number];

export type FillFeature = {
  /** Convex ring in tile coordinates, unclosed. */
  ring: number[];
  color: Color;
};

export type LineFeature = {
  path: number[];
  color: Color;
};

export type SourceTile = {
  extent: number;
  fills: FillFeature[];
  lines: LineFeature[];
};

/** What the GPU is allowed to see. No rings, no protobuf, no layer names. */
export type PreparedTile = {
  extent: number;
  fillPositions: Float32Array;
  fillColors: Float32Array;
  fillVertexCount: number;
  linePositions: Float32Array;
  lineColors: Float32Array;
  lineVertexCount: number;
};
