import { prepareTile } from "./cpu/prepare";
import { paintTile } from "./gpu/paint";
import { sampleTile } from "./tile/sample";

const canvas = document.querySelector("#map");
if (!(canvas instanceof HTMLCanvasElement)) {
  throw new Error("Missing canvas");
}

const gl = canvas.getContext("webgl2");
if (!gl) {
  throw new Error("WebGL2 is required");
}

const prepared = prepareTile(sampleTile);
paintTile(gl, prepared);
