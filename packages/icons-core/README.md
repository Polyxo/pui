# @progressiveui/icons-core

Node.js tooling for converting a directory of SVG files into a bundled React
icon package. The package exposes the same API to ESM and CommonJS consumers.

## Usage

```js
import { convertFolder, jsx } from "@progressiveui/icons-core";

await convertFolder("./icons", "./generated-icons", jsx);
```

CommonJS:

```js
const { convertFolder, jsx } = require("@progressiveui/icons-core");

await convertFolder("./icons", "./generated-icons", jsx);
```

`convertFolder` clears the output directory, converts every `.svg` file, writes
an `index.js`, and produces ESM and UMD bundles. The package also exports
`svgOptimized` for optimized SVG output.

## Requirements

- Node.js 18 or newer
- An input directory containing SVG files

## License

Apache-2.0. See `LICENSE`.
