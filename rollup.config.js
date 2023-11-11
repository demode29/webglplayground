// import multiInput from "./node_modules/rollup-plugin-multi-input/dist/plugin.cjs";
import multiInput from "rollup-plugin-multi-input";

export default {
  input: ["projects/project1/project1.js"],
  output: {
    dir: "dist",
    format: "esm",
    name: "dist",
  },
  plugins: [multiInput.default({ relative: "projects/" })],
};
