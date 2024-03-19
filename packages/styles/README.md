# @wfp/styles

> Styles for the Bridge Design System

## Getting started

To install `@wfp/styles` in your project, you will need to run the following
command using [npm](https://www.npmjs.com/):

```bash
npm install -S @wfp/styles
```

If you prefer [Yarn](https://yarnpkg.com/en/), use the following command
instead:

```bash
yarn add @wfp/styles
```

This package requires [Dart Sass](http://npmjs.com/package/sass) in order to
compile. It uses
[Sass modules](https://css-tricks.com/introducing-sass-modules/) to organize the
codebase and provide exports to use.

If you're new to Sass, or are wondering how to configure Sass for your project,
we recommend checking out the following resources and links:

- [Sass Basics](https://sass-lang.com/guide)
- [Webpack with Sass](https://webpack.js.org/loaders/sass-loader/)
- [Next.js with Sass](https://nextjs.org/docs/basic-features/built-in-css-support#sass-support)
- [Create React App with Sass](https://create-react-app.dev/docs/adding-a-sass-stylesheet/)
- [Parcel with Sass](https://v2.parceljs.org/languages/sass/)
- [Vite with Sass](https://vitejs.dev/guide/features.html#css-pre-processors)
- [Snowpack with Sass](https://www.snowpack.dev/guides/sass/)

Once you get Sass up and running in your project, make sure to configure Sass to
include `node_modules` in its `includePaths` option. For more information,
checkout the [configuration](./docs/sass.md#configuration) section in our Sass
docs.

## Usage

You can bring in all the styles for the Carbon Design System by including
`@wfp/styles` in your Sass files. For example:

```scss
@use "@wfp/styles";
```

If you only would like to bring in specific components, you can
import them in a similar way:

```scss
@use "@wfp/styles/scss/reset";
@use "@wfp/styles/scss/components/accordion";
@use "@wfp/styles/scss/components/button";
@use "@wfp/styles/scss/components/checkbox";
```

There are various helpers that you can include, as well, such as a
CSS reset, grid, breakpoint helpers, and more. You can include these similar to
how you bring in components:

```scss
// Bring in the CSS Reset
@use "@wfp/styles/scss/reset";

// Bring in the CSS Grid
@use "@wfp/styles/scss/grid";
```

To learn more about the various helpers that `@wfp/styles` provides, checkout
the overview of the files available to use in our
[Sass docs](./docs/sass.md#files).

## 🙌 Contributing

We're always looking for contributors to help us fix bugs, build new features,
or help us improve the project documentation. If you're interested, definitely
check out our [Contributing Guide](/.github/CONTRIBUTING.md)! 👀

## 📝 License

Licensed under the [Apache 2.0 License](/LICENSE).
