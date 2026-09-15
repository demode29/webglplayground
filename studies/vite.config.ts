import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  server: {
    port: 5174,
    host: "0.0.0.0",
  },
  build: {
    rollupOptions: {
      input: {
        hub: resolve(__dirname, "index.html"),
        ray: resolve(__dirname, "01-ray-triangle/index.html"),
        quat: resolve(__dirname, "02-quaternion-rotation/index.html"),
        camera: resolve(__dirname, "03-camera-view/index.html"),
      },
    },
  },
});
