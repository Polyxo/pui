import type { StorybookConfig } from "@storybook/react";
const config: StorybookConfig = {
  stories: ["../src/**/*stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  core: {
    builder: "@storybook/builder-vite", // 👈 The builder enabled here.
  },
  addons: [
    "@storybook/blocks",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/preset-create-react-app",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-vite",
  },
  /* typescript: {
    check: false,
    checkOptions: {},
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
    },
  },*/
  /*webpackFinal: async (config, { configType }) => {
    const tsConfigIndex = config.plugins.findIndex(
      (v) => v.constructor.name === 'ForkTsCheckerWebpackPlugin'
    );
    config.plugins.splice(tsConfigIndex, 1);
    return config;
  },*/ docs: {
    autodocs: true,
  },
};
export default config;
