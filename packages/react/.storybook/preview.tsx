import React from "react";
import type { Decorator, Preview } from "@storybook/react-vite";
import "./storybook.scss";
import docsTheme from "./theme.js";
import { WFPCoreProvider } from "../src/components/WFPCoreSettings";
import "@fontsource-variable/open-sans/wdth.css";

const withThemeProvider: Decorator = (Story, context) => {
  const theme = context.globals.theme ?? "light";
  const locale = context.globals.locale ?? "ltr";

  document.body.classList.remove("wfp--theme-light", "wfp--theme-dark");
  document.body.classList.add(`wfp--theme-${theme}`);

  return (
    <div
      className={`wfp--theme-${theme} wfp--theme-${locale}`}
      dir={locale === "rtl" ? "rtl" : "ltr"}
    >
      <Story />
    </div>
  );
};

const withWFPCoreProvider: Decorator = (Story) => (
  <WFPCoreProvider prefix="wfp">
    <Story />
  </WFPCoreProvider>
);

const preview: Preview = {
  tags: ["autodocs"],
  initialGlobals: {
    locale: "ltr",
    theme: "light",
  },
  globalTypes: {
    locale: {
      description: "Text direction",
      toolbar: {
        icon: "globe",
        items: [
          { value: "ltr", title: "Left to right" },
          { value: "rtl", title: "Right to left" },
        ],
        dynamicTitle: true,
      },
    },
    theme: {
      description: "Component theme",
      toolbar: {
        icon: "paintbrush",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [withThemeProvider, withWFPCoreProvider],
  parameters: {
    controls: { expanded: true },
    docs: {
      theme: docsTheme,
    },
    options: {
      storySort: {
        order: ["Getting started", "Documentation", "Templates", "Components"],
      },
    },
  },
};

export default preview;
