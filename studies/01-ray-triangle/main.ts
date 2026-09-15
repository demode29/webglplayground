import {
  intersectRayTriangle,
  mat4,
  rayFromNdc,
  vec3,
  type Vec3,
} from "../shared/math";
import { createDrawer } from "../shared/webgl";

const triangle: [Vec3, Vec3, Vec3] = [
  [-0.9, -0.5, 0.1],
  [1.1, -0.4, -0.2],
  [0.1, 1.0, 0.35],
];

const canvas = document.querySelector("canvas");
const hud = document.querySelector("#hud");
if (!(canvas instanceof HTMLCanvasElement) || !(hud instanceof HTMLElement)) {
  throw new Error("Missing canvas or hud");
}

const drawer = createDrawer(canvas);
let lastRay: { origin: Vec3; direction: Vec3 } | null = null;
let lastHit = intersectRayTriangle(
  { origin: [0, 0.2, 2.5], direction: vec3.normalize([0.05, -0.05, -1]) },
  triangle[0],
  triangle[1],
  triangle[2]
);
lastRay = { origin: [0, 0.2, 2.5], direction: vec3.normalize([0.05, -0.05, -1]) };

const render = () => {
  const aspect = canvas.clientWidth / Math.max(canvas.clientHeight, 1);
  const projection = mat4.perspective((45 * Math.PI) / 180, aspect, 0.1, 40);
  const view = mat4.lookAt([2.3, 1.4, 3.2], [0, 0.2, 0], [0, 1, 0]);
  const mvp = mat4.multiply(projection, view);

  const [a, b, c] = triangle;
  const fill = {
    positions: [...a, ...b, ...c],
    colors: [
      0.35, 0.55, 0.72, 0.95, 0.45, 0.62, 0.78, 0.95, 0.55, 0.7, 0.82, 0.95,
    ],
  };
  const lines = {
    positions: [...a, ...b, ...b, ...c, ...c, ...a],
    colors: new Array(6 * 4).fill(0).map((_, i) => (i % 4 === 3 ? 1 : 0.92)),
  };

  const extraPos: number[] = [];
  const extraCol: number[] = [];
  const pointsPos: number[] = [];
  const pointsCol: number[] = [];

  if (lastRay) {
    const end = vec3.add(lastRay.origin, vec3.scale(lastRay.direction, 8));
    extraPos.push(...lastRay.origin, ...end);
    extraCol.push(0.95, 0.82, 0.35, 1, 0.95, 0.82, 0.35, 1);
  }
  if (lastHit) {
    pointsPos.push(...lastHit.point);
    pointsCol.push(0.95, 0.35, 0.28, 1);
  }

  drawer.draw(
    mvp,
    {
      triangles: fill,
      lines: {
        positions: [...lines.positions, ...extraPos],
        colors: [...lines.colors, ...extraCol],
      },
      points: pointsPos.length
        ? { positions: pointsPos, colors: pointsCol, size: 14 }
        : undefined,
    },
    [0.09, 0.09, 0.08, 1]
  );

  if (!lastRay) {
    hud.textContent = "Click the canvas. A pixel is not a point in the world — it is a ray.";
    return;
  }
  if (!lastHit) {
    hud.textContent = "miss  (ray did not hit the triangle)";
    return;
  }
  const w = 1 - lastHit.u - lastHit.v;
  hud.textContent =
    `hit   t=${lastHit.t.toFixed(3)}   barycentric u=${lastHit.u.toFixed(3)}  v=${lastHit.v.toFixed(3)}  w=${w.toFixed(3)}\n` +
    `point ${lastHit.point.map((n) => n.toFixed(3)).join(", ")}`;
};

canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const ndcX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  const ndcY = 1 - ((event.clientY - rect.top) / rect.height) * 2;
  const aspect = canvas.clientWidth / Math.max(canvas.clientHeight, 1);
  const projection = mat4.perspective((45 * Math.PI) / 180, aspect, 0.1, 40);
  const view = mat4.lookAt([2.3, 1.4, 3.2], [0, 0.2, 0], [0, 1, 0]);
  const ray = rayFromNdc(ndcX, ndcY, view, projection);
  lastRay = ray;
  lastHit = ray
    ? intersectRayTriangle(ray, triangle[0], triangle[1], triangle[2])
    : null;
  render();
});

window.addEventListener("resize", render);
render();
