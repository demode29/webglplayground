import { eulerYXZ, quat, vec3 } from "../shared/math";
import { triadLines } from "../shared/geom";
import { createDrawer } from "../shared/webgl";
import { mat4 } from "../shared/math";

const canvas = document.querySelector("canvas");
const hud = document.querySelector("#hud");
const pitchEl = document.querySelector("#pitch");
const yawEl = document.querySelector("#yaw");
const rollEl = document.querySelector("#roll");
const angleEl = document.querySelector("#angle");
if (
  !(canvas instanceof HTMLCanvasElement) ||
  !(hud instanceof HTMLElement) ||
  !(pitchEl instanceof HTMLInputElement) ||
  !(yawEl instanceof HTMLInputElement) ||
  !(rollEl instanceof HTMLInputElement) ||
  !(angleEl instanceof HTMLInputElement)
) {
  throw new Error("Missing controls");
}

const drawer = createDrawer(canvas);
const axis = vec3.normalize([0.2, 1, 0.15]);

const read = (el: HTMLInputElement) => (Number(el.value) * Math.PI) / 180;

const render = () => {
  const pitch = read(pitchEl);
  const yaw = read(yawEl);
  const roll = read(rollEl);
  const angle = read(angleEl);
  const euler = eulerYXZ(pitch, yaw, roll);
  const q = quat.fromAxisAngle(axis, angle);
  const qMat = quat.toMat4(q);

  const left = triadLines(euler, [-1.35, 0, 0], 0.9);
  const right = triadLines(qMat, [1.35, 0, 0], 0.9);

  const aspect = canvas.clientWidth / Math.max(canvas.clientHeight, 1);
  const mvp = mat4.multiply(
    mat4.perspective((45 * Math.PI) / 180, aspect, 0.1, 40),
    mat4.lookAt([0, 1.15, 4.2], [0, 0, 0], [0, 1, 0])
  );

  drawer.draw(
    mvp,
    {
      lines: {
        positions: [...left.positions, ...right.positions],
        colors: [...left.colors, ...right.colors],
      },
    },
    [0.09, 0.09, 0.08, 1]
  );

  const lock = Math.abs(Math.abs(pitch) - Math.PI / 2) < 0.12;
  hud.textContent =
    `LEFT  Euler YXZ   pitch=${pitchEl.value}°  yaw=${yawEl.value}°  roll=${rollEl.value}°` +
    (lock ? "   ⚠ pitch ~ 90°: yaw and roll share an axis" : "") +
    `\nRIGHT quaternion axis-angle   q = (${q.map((n) => n.toFixed(3)).join(", ")})` +
    `\n      axis (${axis.map((n) => n.toFixed(2)).join(", ")})  angle=${angleEl.value}°`;
};

for (const el of [pitchEl, yawEl, rollEl, angleEl]) {
  el.addEventListener("input", render);
}
window.addEventListener("resize", render);
render();
