import { addons } from "storybook/manager-api";
import WfpTheme from "./WfpTheme.js";

addons.setConfig({
  theme: WfpTheme,
  layout: {
    panelPosition: "bottom",
  },
});
