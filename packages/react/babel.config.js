module.exports = {
  presets: [
    "@babel/preset-env",
    "@babel/preset-react",
    "@babel/preset-typescript",
  ],
  plugins: [
    "dev-expression",
    "@babel/plugin-transform-class-properties",
    "@babel/plugin-transform-export-namespace-from",
  ],
};
