import { defineConfig } from "rollup";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import esbuild from "rollup-plugin-esbuild";

export default defineConfig({
  input: "src/index.ts",
  output: {
    dir: "dist",
    format: "esm", // modern ESM output
    sourcemap: true,
    entryFileNames: "[name].[hash].js",
  },
  plugins: [
    resolve({
      browser: true,
      preferBuiltins: false,
    }),
    commonjs(),
    esbuild({
      target: "esnext", // only modern browsers
      minify: true,
      sourcemap: true,
    }),
  ],
});
