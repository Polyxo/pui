## themes-core

The themes core generates design tokens by using [Style Dictionary](https://amzn.github.io/style-dictionary/#).

### Using existing theme

TODO: Add paragraph

```
import variables from @wfp/themes-core/scss/variables;
```

## Building a theme

### Generate Source json on your own

The source can be `json`, preferably generated from Figma using [Design Tokens](https://github.com/lukasoppermann/design-tokens).

An example can be found in `tokens/design-tokens.tokens.json`

```jsx
// Add this to your package.json to generate a theme
scripts: {
    "build:theme": "node buildTheme.js",
}
```

```jsx
// buildTheme.js configuration
const { config } = require("@wfp/themes-core/config.js");

/*
config() can be configured
source: defines the lookup for finding
Example can be found in tokens/design-tokens.tokens.json
*/
const source = "tokens/**/*.json";

// BuildPath: Output for the build
const buildPath = "dist";

config({ source, buildPath });
```

### Development

### `build`

Builds themes from existing raw tokens.

```bash
yarn build
```

### `build:tokens`

A shorthand command that executes `sync:tokens`, `filter:theme`, and `build`. This script does the synchronization of design tokens, filtering of theme data, and the final theme build.

```bash
yarn build:tokens
```

### `sync:tokens`

Downloads the latest `tokens.json` (Figma Tokens) from the tokens repository.

Create a `.env` with [GIT_ACCESS_TOKEN](https://learn.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate).

```bash
yarn sync:tokens
```

### `filter:theme`

TODO: Remove this once the token source is cleaned up.

Prepares raw tokens and cleans them up.

```bash
yarn filter:theme
```
