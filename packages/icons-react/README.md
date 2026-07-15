# @progressiveui/icons-react

Generated React components for the Progressive UI icon set.

## Install

```sh
npm install @progressiveui/icons-react
```

## Usage

Use named exports from the package root. Icon names do not include a numeric
size suffix.

```tsx
import { Add, WarningFilled } from "@progressiveui/icons-react";

export function Actions() {
  return (
    <>
      <Add aria-label="Add" width={16} height={16} />
      <WarningFilled aria-hidden="true" className="warning-icon" />
    </>
  );
}
```

The generated components accept standard `React.SVGProps<SVGSVGElement>` plus
an optional `description` prop. Their default dimensions are `1em`, and paths
use `currentColor`, so size and color can be controlled with props or CSS.

```css
.warning-icon {
  color: #c5192d;
  width: 1.25rem;
  height: 1.25rem;
}
```

The root export supports native ESM and CommonJS. A UMD bundle remains at
`umd/index.js` for compatibility.

## Accessibility

Provide an accessible name when the icon conveys meaning, or mark decorative
icons with `aria-hidden="true"`. Buttons and links should normally get their
accessible name from visible text rather than from the icon alone.

## License

Apache-2.0. See `LICENSE`.
