import React, { FC } from "react";
import "./storybook.scss";
import theme from "./theme";
import { WFPCoreProvider } from "../src/components/WFPCoreSettings";

import { themes, ensure } from "@storybook/theming";

import "@fontsource-variable/open-sans/wdth.css";

export const parameters = {
  controls: { expanded: true },
  docs: {
    //components: { ...mdxComponents },
    theme: theme,
    //theme: ensure(themes.dark),
    //page: DocsPage,
  },
  options: {
    storySort: {
      order: ["Getting started", "Documentation", "Templates", "Components"],
    },
  },
};

const withThemeProvider = (Story, context) => {
  const { locale, theme } = context.globals;
  document.body.classList.remove(
    `wfp--theme-${theme === "light" ? "dark" : "light"}`
  );
  document.body.classList.add(`wfp--theme-${theme}`);
  return (
    <div
      className={`wfp--theme-${theme} wfp--theme-${locale}`}
      dir={locale === "rtl" ? "rtl" : null}
    >
      <Story {...context} />
    </div>
  );
};

const withWFPCoreProvider = (Story) => (
  <WFPCoreProvider prefix="wfp">
    <Story />
  </WFPCoreProvider>
);

export const decorators = [withThemeProvider, withWFPCoreProvider];
