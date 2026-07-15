import { defineConfig } from "vite";
import path from "path";
import { readFile, writeFile } from "node:fs/promises";
import dts from "vite-plugin-dts";

const distDirectory = path.resolve(__dirname, "dist");
const legacyArtifacts = [
  ["index.mjs", "index.es.js"],
  ["index.cjs", "index.cjs.js"],
];

const isReactExternal = (id) =>
  /^(?:react|react-dom)(?:\/.*)?$/.test(id);

function legacyCompatibilityArtifacts() {
  return {
    name: "legacy-compatibility-artifacts",
    apply: "build",
    async closeBundle() {
      await Promise.all(
        legacyArtifacts.map(async ([sourceFile, legacyFile]) => {
          const sourcePath = path.join(distDirectory, sourceFile);
          const legacyPath = path.join(distDirectory, legacyFile);
          const sourceMapPath = `${sourcePath}.map`;
          const legacyMapPath = `${legacyPath}.map`;

          const [code, sourceMapContents] = await Promise.all([
            readFile(sourcePath, "utf8"),
            readFile(sourceMapPath, "utf8"),
          ]);
          const sourceMap = JSON.parse(sourceMapContents);

          sourceMap.file = legacyFile;

          await Promise.all([
            writeFile(
              legacyPath,
              code.replace(
                `sourceMappingURL=${sourceFile}.map`,
                `sourceMappingURL=${legacyFile}.map`
              )
            ),
            writeFile(legacyMapPath, JSON.stringify(sourceMap)),
          ]);
        })
      );
    },
  };
}

export default defineConfig({
  plugins: [
    dts({
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
