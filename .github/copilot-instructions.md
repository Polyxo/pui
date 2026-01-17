# Progressive UI Design System - AI Coding Agent Guide

## Project Overview

This is a **Lerna monorepo** for the Progressive UI Design System (formerly based on WFP-UI), a React component library with independent versioning across packages. The project uses **yarn workspaces** with **Lerna** for package management and automated publishing via Azure DevOps pipelines.

## Architecture & Package Structure

```
packages/
├── react/             # Main React component library (@progressiveui/react)
├── icons/             # SVG icons source
├── icons-core/        # Icon generation tooling (svgo + react-svgr)
├── icons-react/       # Generated React icon components (@progressiveui/icons-react)
├── styles/            # SCSS styles compiled to CSS (@progressiveui/styles)
├── themes-core/       # Design tokens & theming (@progressiveui/themes-core)
└── website/           # Next.js documentation site
```

### Key Dependencies Between Packages
- `react` depends on `icons-react`, `styles`, and `themes-core`
- `styles` depends on `themes-core` for design tokens
- `website` consumes all public packages for documentation

## Development Workflows

### Initial Setup
```bash
yarn install          # Install all dependencies (uses --frozen-lockfile in CI)
yarn build            # Build all packages (required before first run)
```

### Working on React Components
```bash
cd packages/react
yarn dev              # Starts Storybook on http://localhost:9000
yarn test             # Run Jest tests
yarn build            # Build via Vite (generates dist/index.es.js, index.cjs.js, index.d.ts)
```

**Build outputs**: Vite generates ESM, CJS, and UMD formats. TypeScript definitions are generated separately via `generate:types` script.

### Component Development Pattern

Components live in `packages/react/src/components/[ComponentName]/`:
```
Button/
├── Button.tsx           # Main component (TypeScript + JSDoc props)
├── Button.stories.tsx   # Storybook stories (uses CSF3 format)
├── Button.test.tsx      # Jest + Testing Library tests
├── Button.Skeleton.tsx  # Loading skeleton variant (optional)
└── index.tsx            # Re-exports
```

**Critical conventions**:
- Use `React.forwardRef` for all components that render DOM elements
- Export from `src/index.ts` to include in public API
- Props use JSDoc `@design` tag to highlight design-relevant properties
- Component types use conditional props pattern (see [Button.tsx](packages/react/src/components/Button/Button.tsx#L57-L73) for button vs anchor polymorphism)

### Storybook Configuration
- **Framework**: Storybook 8.6 with Vite (`@storybook/react-vite`)
- **Story pattern**: `src/**/*.stories.@(js|jsx|ts|tsx)`
- **Assets**: Loaded via `STORYBOOK_ASSETS` environment variable in dev mode
- Stories use CSF3 format with `Meta` and `StoryObj` types

### Testing
```bash
cd packages/react
yarn test             # Jest with ts-jest preset
yarn jest-w           # Watch mode
```
- Test files: `**/?(*.)+(spec|test).+(ts|tsx|js)` in `src/`
- Uses `@testing-library/react` and `@testing-library/jest-dom`
- Config: `jest.config.js` (not in root package.json)

### Icon Generation
```bash
cd packages/icons-core
node build/index.js   # Generates optimized React components from SVGs
```
Icons are processed with SVGO and converted to React components via SVGR. Output goes to `packages/icons-react/`.

### Theme & Style System
- **Tokens**: Managed in `packages/themes-core/tokens/` using Style Dictionary
- **Build**: `yarn build:tokens` syncs Figma tokens → filters → generates CSS/SCSS variables
- **Styles**: SCSS compiled with Sass, loads from `node_modules` and mono repo root
- **CSS output**: `packages/styles/styles.css` (compressed, no source maps)

## Version Management & Publishing

### Conventional Commits Required
All commits must follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` triggers minor version bump
- `fix:`, `perf:` triggers patch version bump
- `BREAKING CHANGE:` in footer triggers major version bump

### Publishing Process (Azure DevOps)
- **Main branch** → publishes as `@latest` tag
- **Develop branch** → publishes as `@alpha` tag
- Pipeline runs `lerna:versionNoPush` → `lerna:publishFromPackage[Alpha]`

### Local Alpha Publishing
```bash
yarn publish:alpha-cli  # Publish all changed packages as @alpha
```

## Project-Specific Patterns

### Component Prop Typing
Use discriminated unions for polymorphic components (button/link):
```typescript
type ConditionalProps<T> = T extends { href: string }
  ? ButtonLinkProps
  : ButtonButtonProps;
```

### Settings Hook Pattern
Components use `useSettings()` hook from `packages/react/src/hooks/useSettings` to access global configuration (wrappers, base paths, etc.)

### Legacy Code Location
`packages/react/othersrc/` contains older components not yet migrated to TypeScript. These are NOT exported from main index but may be referenced. Examples: `FormWizard`, `FileUploader`, `ReduxFormWrapper`.

### TypeScript Configuration
- **Target**: ES6, module: ES6
- **JSX**: `react-jsx` (automatic runtime)
- **Strict mode**: Enabled, but `noImplicitAny: false` for gradual migration
- **Special**: `allowImportingTsExtensions: true` for `.ts` imports

## Critical Files & References

- [packages/react/src/index.ts](packages/react/src/index.ts) - Public API exports
- [lerna.json](lerna.json) - Independent versioning config
- [azure-pipelines.yml](azure-pipelines.yml) - CI/CD publish flow
- [packages/react/vite.config.js](packages/react/vite.config.js) - Build configuration
- [packages/themes-core/scripts/](packages/themes-core/scripts/) - Token generation scripts

## Common Tasks

**Add new component**: 
1. Create folder in `packages/react/src/components/[Name]/`
2. Add `[Name].tsx`, `[Name].stories.tsx`, `index.tsx`
3. Export from `packages/react/src/index.ts`

**Update design tokens**:
1. Sync from Figma: `cd packages/themes-core && yarn build:tokens`
2. Rebuild styles: `cd packages/styles && yarn build`

**Update icons**:
1. Add SVGs to `packages/icons/src/svg/`
2. Run `cd packages/icons-core && node build/index.js`
3. Icons appear in `@progressiveui/icons-react`

**Preview documentation locally**:
```bash
cd packages/website
yarn dev  # Next.js on http://localhost:3000
```
