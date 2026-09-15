import { formatMat4, mat4, vec3 } from "../shared/math";
import { boxLines, gridLines } from "../shared/geom";
import { createDrawer } from "../shared/webgl";

const canvas = document.querySelector("canvas");
const hud = document.querySelector("#hud");
if (!(canvas instanceof HTMLCanvasElement) || !(hud instanceof HTMLElement)) {
  throw new Error("Missing canvas or hud");
}

const drawer = createDrawer(canvas);
const target = vec3.create(0, 0.4, 0);
let azimuth = 0.7;
let elevation = 0.45;
let distance = 8;
let dragging = false;
let lastX = 0;
let lastY = 0;

const eyeFromOrbit = () => {
  const x = distance * Math.cos(elevation) * Math.sin(azimuth);
  const y = distance * Math.sin(elevation);
  const z = distance * Math.cos(elevation) * Math.cos(azimuth);
  return vec3.add(target, [x, y, z]);
};

const render = () => {
  const eye = eyeFromOrbit();
  const aspect = canvas.clientWidth / Math.max(canvas.clientHeight, 1);
  const projection = mat4.perspective((50 * Math.PI) / 180, aspect, 0.1, 80);
  const view = mat4.lookAt(eye, target, [0, 1, 0]);
  const mvp = mat4.multiply(projection, view);

  const grid = gridLines(5, 1);
  const a = boxLines([-2, 0.5, -1], [1, 1, 1], [0.85, 0.45, 0.35, 1]);
  const b = boxLines([1.5, 0.35, 2], [0.7, 0.7, 0.7], [0.4, 0.7, 0.55, 1]);
  const c = boxLines([0.2, 0.8, -2.4], [0.6, 1.6, 0.6], [0.45, 0.6, 0.88, 1]);

  drawer.draw(
    mvp,
    {
      lines: {
        positions: [...grid.positions, ...a.positions, ...b.positions, ...c.positions],
        colors: [...grid.colors, ...a.colors, ...b.colors, ...c.colors],
      },
    },
    [0.09, 0.09, 0.08, 1]
  );

  hud.textContent =
    `eye  ${eye.map((n) => n.toFixed(2)).join(", ")}    drag to orbit, wheel to dolly\n\n` +
    `view (world → camera)\n${formatMat4(view)}\n\n` +
    `clip = projection × view × world`;
};

canvas.addEventListener("pointerdown", (event) => {
  dragging = true;
  lastX = event.clientX;
  lastY = event.clientY;
  canvas.setPointerCapture(event.pointerId);
});
canvas.addEventListener("pointerup", () => {
  dragging = false;
});
canvas.addEventListener("pointermove", (event) => {
  if (!dragging) {
    return;
  }
  azimuth -= (event.clientX - lastX) * 0.008;
  elevation += (event.clientY - lastY) * 0.008;
  elevation = Math.min(1.15, Math.max(0.12, elevation));
  lastX = event.clientX;
  lastY = event.clientY;
  render();
});
canvas.addEventListener(
  "wheel",
  (event) => {
    event.preventDefault();
    distance *= event.deltaY > 0 ? 1.08 : 0.92;
    distance = Math.min(18, Math.max(3, distance));
    render();
  },
  { passive: false }
);
window.addEventListener("resize", render);
render();
