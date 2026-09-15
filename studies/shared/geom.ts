import { mat4, vec3, type Mat4, type Vec3 } from "./math";

export const pushLine = (
  positions: number[],
  colors: number[],
  a: Vec3,
  b: Vec3,
  color: readonly [number, number, number, number]
) => {
  positions.push(...a, ...b);
  colors.push(...color, ...color);
};

export const triadLines = (rotation: Mat4, origin: Vec3, scale: number) => {
  const positions: number[] = [];
  const colors: number[] = [];
  const axis = (local: Vec3, color: readonly [number, number, number, number]) => {
    const tip = vec3.add(origin, vec3.scale(mat4.transformPoint(rotation, local), scale));
    pushLine(positions, colors, origin, tip, color);
  };
  axis([1, 0, 0], [0.86, 0.32, 0.28, 1]);
  axis([0, 1, 0], [0.42, 0.72, 0.38, 1]);
  axis([0, 0, 1], [0.35, 0.55, 0.9, 1]);
  return { positions, colors };
};

export const gridLines = (half: number, step: number) => {
  const positions: number[] = [];
  const colors: number[] = [];
  const muted: [number, number, number, number] = [0.35, 0.33, 0.3, 1];
  const axis: [number, number, number, number] = [0.55, 0.5, 0.42, 1];
  for (let i = -half; i <= half; i += step) {
    const color = i === 0 ? axis : muted;
    pushLine(positions, colors, [i, 0, -half], [i, 0, half], color);
    pushLine(positions, colors, [-half, 0, i], [half, 0, i], color);
  }
  return { positions, colors };
};

export const boxLines = (center: Vec3, size: Vec3, color: readonly [number, number, number, number]) => {
  const positions: number[] = [];
  const colors: number[] = [];
  const [cx, cy, cz] = center;
  const hx = size[0] / 2;
  const hy = size[1] / 2;
  const hz = size[2] / 2;
  const p: Vec3[] = [
    [cx - hx, cy - hy, cz - hz],
    [cx + hx, cy - hy, cz - hz],
    [cx + hx, cy - hy, cz + hz],
    [cx - hx, cy - hy, cz + hz],
    [cx - hx, cy + hy, cz - hz],
    [cx + hx, cy + hy, cz - hz],
    [cx + hx, cy + hy, cz + hz],
    [cx - hx, cy + hy, cz + hz],
  ];
  const edges: Array<[number, number]> = [
    [0, 1], [1, 2], [2, 3], [3, 0],
    [4, 5], [5, 6], [6, 7], [7, 4],
    [0, 4], [1, 5], [2, 6], [3, 7],
  ];
  for (const [i, j] of edges) {
    pushLine(positions, colors, p[i], p[j], color);
  }
  return { positions, colors };
};
