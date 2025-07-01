import { defineConfig } from "vite";
import path from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    dts({
      entryRoot: "src",
      outputDir: "dist", // will emit index.d.ts next to your .js files
      // tsConfigFilePath: "./tsconfig.build.json",
      exclude: ["**/*.stories.tsx", "**/*.stories.ts"],
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "MyViteLibrary",
      formats: ["es", "cjs", "umd"],
      fileName: (format) => `index.${format}.js`,
    },
    target: "esnext",
    sourcemap: true,
    outDir: "dist",
    rollupOptions: {
      external: ["react"],
      output: {
        globals: {
          react: "React",
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
