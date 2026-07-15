# @progressiveui/themes-core

Style Dictionary configuration, token sources, and generated theme artifacts
for Progressive UI.

## Use the published theme

Sass consumers can load the generated mixin through the exported subpath:

```scss
@use "@progressiveui/themes-core/dist/scss/default-css-theme" as theme;

:root {
  @include theme.theme-default();
}
```

## Build a custom theme

The configuration API is ESM-only:

```js
import { config } from "@progressiveui/themes-core";

config({
  source: "tokens/**/*.json",
  buildPath: "dist",
  themeName: "default",
});
```

`source` is a glob for Style Dictionary-compatible JSON token files.
`buildPath` is the output directory, and `themeName` controls the generated
Sass mixin name.

## Repository commands

```sh
yarn build         # Build the local default theme from checked-in tokens
yarn build:tokens  # Sync remote tokens, filter them, and build
```

`build:tokens` requires `GIT_ACCESS_TOKEN` and contacts the private Azure token
repository. Routine local and pull-request validation uses `yarn build` and
does not perform remote synchronization. The tracked legacy dark artifact is
preserved until its source format has a golden compatibility fixture.

## License

Apache-2.0. See `LICENSE`.
