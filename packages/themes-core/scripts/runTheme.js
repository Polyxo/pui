import { config } from "./config.js";

config({
  source: `tokens/**/*.json`,
  buildPath: "dist",
  themeName: "default",
});
