import type { SourceTile } from "./types";

const WATER: [number, number, number, number] = [0.55, 0.72, 0.86, 1];
const PARK: [number, number, number, number] = [0.72, 0.84, 0.68, 1];
const ROAD: [number, number, number, number] = [0.96, 0.93, 0.86, 1];
const ARTERY: [number, number, number, number] = [0.93, 0.78, 0.48, 1];

/**
 * A fake tile in MVT-like extent. Stands in for a .pbf until decode lives in WASM.
 * Convex rings only — triangulation stays a fan, not a library.
 */
export const sampleTile: SourceTile = {
  extent: 4096,
  fills: [
    {
      ring: [0, 2500, 4096, 2500, 4096, 4096, 0, 4096],
      color: WATER,
    },
    {
      ring: [1860, 0, 2220, 0, 2220, 2680, 1860, 2680],
      color: WATER,
    },
    {
      ring: [380, 420, 1480, 420, 1480, 1680, 380, 1680],
      color: PARK,
    },
    {
      ring: [2680, 520, 3780, 520, 3780, 1760, 2680, 1760],
      color: PARK,
    },
  ],
  lines: [
    { path: [0, 2100, 4096, 2100], color: ARTERY },
    { path: [1200, 0, 1200, 2500], color: ROAD },
    { path: [3200, 0, 3200, 2500], color: ROAD },
    { path: [0, 980, 1860, 980], color: ROAD },
    { path: [2220, 1320, 4096, 1320], color: ROAD },
  ],
};
