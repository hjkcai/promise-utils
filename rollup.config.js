import resolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";

export default {
  input: "./src/index.ts",
  output: {
    file: "./dist/promise-utils.js",
    format: "esm",
    sourcemap: true
  },
  plugins: [
    resolve(),
    typescript({
      tsconfig: "tsconfig.esm.json"
    })
  ]
};
