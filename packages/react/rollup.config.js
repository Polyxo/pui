("use strict");

import { babel } from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import stripBanner from "rollup-plugin-strip-banner";
// TODO; Check terser
import { terser } from "rollup-plugin-terser";
import packageJson from "./package.json";
import typescript from "@rollup/plugin-typescript";
import { visualizer } from "rollup-plugin-visualizer";

const baseConfig = {
  input: "./src/index.ts",

  external: [
    ...Object.keys(packageJson.peerDependencies),
    ...Object.keys(packageJson.dependencies),
    ...Object.keys(packageJson.devDependencies),
    "prop-types",
    "react",
    "react-dom",
    "classnames",
  ],

  plugins: [
    nodeResolve(),
    commonjs({
      include: /node_modules/,
    }),
    typescript({
      sourceMap: false,
      compilerOptions: {
        declaration: true,
      },
      exclude: [
        "**/__tests__",
        "**/*.test.ts",
        "**/*.stories.tsx",
        "**/indexStories.ts",
      ],
    }),
    babel({
      babelrc: false,
      exclude: ["node_modules/**"],
      presets: [
        [
          "@babel/preset-env",
          {
            modules: false,
            targets: {
              browsers: ["extends browserslist-config-carbon"],
            },
          },
        ],
        "@babel/preset-react",
        "@babel/preset-typescript",
      ],
      plugins: [
        "dev-expression",
        "@babel/plugin-syntax-dynamic-import",
        "@babel/plugin-syntax-import-meta",
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-proposal-export-namespace-from",
        "@babel/plugin-proposal-export-default-from",
      ],
      babelHelpers: "bundled",
    }),
    stripBanner(),
  ],
};

const umdBundleConfig = {
  input: baseConfig.input,
  treeshake: {
    propertyReadSideEffects: false,
    moduleSideEffects: "no-external",
  },
  external: baseConfig.external,
  output: {
    file: "es/index.js",
    format: "es",
    exports: "named",
    sourcemap: false,
    banner: `/*
    * WFP Design System React.js
    */
   'use client';`,
  },
  /*{
      name: 'WfpUiReact',
      format: 'umd',
      globals: {
        classnames: 'classNames',
        'prop-types': 'PropTypes',
        react: 'React',
        'react-dom': 'ReactDOM',
        //'@progressiveui/icons': 'WfpIcons',
      },
    },*/
};

module.exports = [
  // Generates the following bundles:
  // ESM:       es/index.js
  // CommonJS: lib/index.js
  {
    ...baseConfig,
    external: baseConfig.external,
    output: [
      /*{
        format: 'esm',
        file: 'es/index.js',
      },*/
      {
        format: "cjs",
        file: "lib/index.js",
      },
    ],
  },

  // Generate the development UMD bundle:
  // ESM: es/index.js UMD: umd/index.js
  {
    ...umdBundleConfig,
    plugins: [
      ...baseConfig.plugins,
      replace({
        preventAssignment: true,
        "process.env.NODE_ENV": JSON.stringify("development"),
      }),
    ],
    output: {
      ...umdBundleConfig.output,
      format: "esm",
      file: "es/index.js",
    },
  },
  {
    ...umdBundleConfig,
    plugins: [
      ...baseConfig.plugins,
      replace({
        preventAssignment: true,
        "process.env.NODE_ENV": JSON.stringify("development"),
      }),
    ],
    output: {
      ...umdBundleConfig.output,
      file: "umd/index.js",
    },
  },

  // Generate the production UMD bundle:
  // UMD: umd/index.min.js
  {
    ...umdBundleConfig,
    plugins: [
      ...baseConfig.plugins,
      replace({
        preventAssignment: true,
        "process.env.NODE_ENV": JSON.stringify("production"),
      }),
      terser(),
      visualizer({ template: "sunburst" }),
    ],
    output: {
      ...umdBundleConfig.output,
      file: "umd/index.min.js",
    },
  },
];
