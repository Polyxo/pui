import { defineConfig } from "vite";
import path from "path";
import { writeFile } from "node:fs/promises";
import dts from "vite-plugin-dts";

const distDirectory = path.resolve(__dirname, "dist");
const legacyArtifacts = [
  {
    sourceFile: "index.mjs",
    legacyFile: "index.es.js",
    code: 'export * from "./index.mjs";\n',
  },
  {
    sourceFile: "index.cjs",
    legacyFile: "index.cjs.js",
    code: '"use strict";\nmodule.exports = require("./index.cjs");\n',
  },
];

const isReactExternal = (id) =>
  /^(?:react|react-dom)(?:\/.*)?$/.test(id);

function legacyCompatibilityArtifacts() {
  return {
    name: "legacy-compatibility-artifacts",
    apply: "build",
    async closeBundle() {
      await Promise.all(
        legacyArtifacts.map(async ({ sourceFile, legacyFile, code }) => {
          const legacyPath = path.join(distDirectory, legacyFile);
          const legacyMapPath = `${legacyPath}.map`;
          const sourceMap = {
            version: 3,
            file: legacyFile,
            sources: [sourceFile],
            names: [],
            mappings: "",
          };

          await Promise.all([
            writeFile(legacyPath, code),
            writeFile(legacyMapPath, JSON.stringify(sourceMap)),
          ]);
        })
      );
    },
  };
}

export default defineConfig({
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  esbuild: {
    jsx: "transform",
    jsxFactory: "__PuiReact.createElement",
    jsxFragment: "__PuiReact.Fragment",
    jsxInject: 'import * as __PuiReact from "react"',
  },
  plugins: [
    dts({
      tsconfigPath: "./tsconfig.declarations.json",
      entryRoot: "src",
      outputDir: "dist",
      include: ["src/**/*.{ts,tsx,js,jsx}"],
      exclude: [
        "**/__tests__/**",
        "**/__snapshots__/**",
        "**/legacy/**",
        "**/*.stories.*",
        "**/*.test.*",
        "**/*-test.*",
        "**/indexStories.*",
        "**/*.legacy.*",
        "**/*-old*.*",
        "**/*legacy*.*",
        "**/*[Oo]ld*.*",
        "othersrc/**",
      ],
    }),
    legacyCompatibilityArtifacts(),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "MyViteLibrary",
      formats: ["es", "cjs", "umd"],
      fileName: (format) => {
        if (format === "es") return "index.mjs";
        if (format === "cjs") return "index.cjs";
        return "index.umd.js";
      },
    },
    target: "esnext",
    sourcemap: true,
    outDir: "dist",
    rollupOptions: {
      external: isReactExternal,
      output: {
        globals: {
          react: "React",
          "react/jsx-runtime": "ReactJSXRuntime",
          "react/jsx-dev-runtime": "ReactJSXDevRuntime",
          "react-dom": "ReactDOM",
          "react-dom/client": "ReactDOM",
        },
      },
    },
  },
  resolve: {
    alias: {
      epdoptimize: path.resolve(__dirname, "src"),
    },
  },
});
