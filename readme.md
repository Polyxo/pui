# Progressive UI

Progressive UI is a React design-system monorepo derived from the World Food Programme UI Kit. It publishes React components, Sass/CSS, design tokens, React icons, and icon-generation tooling, with a Next.js documentation website.

## Requirements

- Node.js 24 LTS (`>=24 <25`)
- Yarn 1.22.22 (the version in `packageManager`)

```sh
corepack enable
corepack prepare yarn@1.22.22 --activate
yarn install --frozen-lockfile
```

## Workspaces

| Workspace | Purpose |
| --- | --- |
| `@progressiveui/react` | React 19 component library |
| `@progressiveui/styles` | Sass sources and compiled CSS |
| `@progressiveui/themes-core` | Style Dictionary tokens and theme builder |
| `@progressiveui/icons` | Private SVG source workspace |
| `@progressiveui/icons-core` | Icon generation tools |
| `@progressiveui/icons-react` | Generated React icon components |
| `@progressiveui/core-website` | Private Next.js documentation website |

## Development

Run commands from the repository root:

```sh
yarn start:react       # Storybook development server on port 9000
yarn test              # Active React Testing Library suites
yarn lint              # React and website flat-config ESLint
yarn typecheck         # Shipped React API and website TypeScript
yarn build:packages    # Tokens, styles, icons, and React library
yarn build:storybook   # Production Storybook
yarn build:website     # Website assets and Next.js production build
```

The full pre-release gate is:

```sh
yarn validate
```

It also runs ESM/CommonJS/UMD package smoke tests, strict declaration consumption, public-export comparison, and bundle-size comparison. Version and publish scripts invoke this gate. Do not use publish commands as local validation.

## Generated assets

```sh
yarn generate:tokens          # Local default token output
yarn generate:icons           # React icon formats and declarations
yarn generate:website-assets  # Demo bundle and component metadata
```

`packages/themes-core` also has `build:tokens`, which performs an authenticated remote token sync. It is not part of routine local or pull-request validation.
The checked-in legacy dark artifact is intentionally preserved until its source
format and output have a golden compatibility fixture.

## Compatibility

Public component behavior, markup, CSS classes, token names, and `@progressiveui/react` exports are compatibility contracts. Run `yarn verify:public-exports` after changing the React entry point or packaging.

Legacy implementations and JavaScript Enzyme suites are quarantined rather than deleted. Read [packages/react/LEGACY.md](packages/react/LEGACY.md) before touching `othersrc`, `.legacy`, `-old`, Redux Form, React Dates, or React Table v7 code.

## Contributing

- Create a branch; do not work directly on the release branch.
- Use [Conventional Commits](https://www.conventionalcommits.org/).
- Keep commits focused and preserve unrelated working-tree edits.
- Record an existing failure separately from a regression.
- Never print `.npmrc`, tokens, or registry credentials.

See [AGENTS.md](AGENTS.md) for a machine-oriented repository map and [MODERNIZATION.md](MODERNIZATION.md) for the 2026 audit, compatibility decisions, and remaining risks.
