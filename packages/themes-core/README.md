## Style-dictionary

The themes core generates design tokens by using [Style Dictionary](https://amzn.github.io/style-dictionary/#).

### Development

### `build`

```bash
yarn build
```

Builds themes from existing raw tokens.

### `build:tokens`

```bash
yarn build:tokens
```

- **Purpose**: A composite command that sequentially executes `sync:tokens`, `filter:theme`, and `build`. This script ensures a comprehensive update and build process, encompassing the synchronization of design tokens, filtering of theme data, and the final theme build.
- **When to Use**: Use this script for a complete end-to-end update and build process involving design tokens and theme data, ensuring all components are up-to-date and in sync.

### `sync:tokens`

```bash
yarn sync:tokens
```

Downloads the latest `tokens.json` (Figma Tokens) from the tokens repository.

### `filter:theme`

```bash
yarn filter:theme
```

Prepares raw tokens and cleans them up.

### Using existing theme

TODO: Add paragraph
import variables from @wfp/themes-core/scss/variables;

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
