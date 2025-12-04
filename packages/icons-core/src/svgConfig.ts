type SvgrConfig = import("@svgr/core").Config;
type SvgoConfig = NonNullable<SvgrConfig["svgoConfig"]>;
type SvgoPluginConfig = NonNullable<SvgoConfig["plugins"]>[number];

const presetDefaultPlugin = {
  name: "preset-default",
  params: {
    overrides: {
      // customize default plugin options
      /*inlineStyles: {
        onlyMatchedOnce: false,
      },
      removeDoctype: false,
      convertColors: false,*/
      removeUnknownsAndDefaults: false,
      removeViewBox: false,
    },
  },
};

const typedSvgoConfig: SvgoConfig = {
  plugins: [presetDefaultPlugin as unknown as SvgoPluginConfig],
};

export function svgConfig(): SvgrConfig {
  return {
    plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx", "@svgr/plugin-prettier"],
    replaceAttrValues: {
      "#000000": "currentColor",
      "#000": "currentColor",
      //'#CCC': 'currentColor',
      //'url(#a)': 'undefined',
    },
    svgoConfig: typedSvgoConfig,
    icon: true,
  };
}
