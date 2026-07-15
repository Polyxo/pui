# Modernization record

Audit date: 2026-07-15  
Branch: `chore/modernize-monorepo`  
Baseline: `b662910f3` (`feat/april-release`)  
Local validation runtime: Node 24.0.2 and Yarn 1.22.22; CI target: Node 22 and Yarn 1.22.22.

The work started with uncommitted Sass and `sass-loader` updates in the React and website manifests plus their lockfile changes. Those edits were preserved and adopted into the modernization dependency commit.

## Baseline results

These results were recorded before modernization changes. A failed command is not treated as a regression unless it worked here.

| Check | Baseline result |
| --- | --- |
| `yarn install --frozen-lockfile` | Passed after network access was allowed; peer warnings exposed React 19/React 16-era dependency conflicts. |
| Root `yarn build` | Did not complete. `icons-core` generated output but its Rollup process stayed alive and was interrupted. |
| React Jest | Failed: 7 suites passed, 2 suites failed to compile; 46 tests and 3 snapshots passed. Failures were Button event typing and a stale Footer prop. |
| React `tsc --noEmit` | Failed with 82 diagnostics in 42 files, mixing public source, Storybook, tests, `othersrc`, casing problems, and React 19 type changes. |
| React package build | Passed in 137.09 s but printed declaration diagnostics. ESM/CJS/UMD were 279,911/193,166/192,087 bytes. |
| Storybook production build | Failed while Vite parsed `src/components/Checkbox/README.mdx` as a module. |
| Website type-check | Passed. |
| Website lint | Failed because Next 16 no longer implements `next lint`. |
| Website production build | Passed on the network-enabled retry with Sass, MDX/runtime, Prettier plugin, and mismatched Next/MDX warnings. |
| Icon React build | Passed and generated 81 icons. |
| Local token generation | Passed. Authenticated `build:tokens` was not run because it synchronizes from Azure and requires `GIT_ACCESS_TOKEN`. |

Baseline package facts:

- React exposed the same 127 runtime names in its generated formats.
- React declarations included tests, stories, old files, and legacy files.
- The React package tarball contained 400 files (about 3.77 MB).
- React baseline gzip sizes were 69,385 bytes ESM, 57,704 bytes CJS, and 57,548 bytes UMD.
- Icon baseline gzip sizes were 46,685 bytes ESM and 47,015 bytes UMD.
- CSS baseline was 271,808 bytes raw and 37,092 bytes gzip.

## Implemented changes

### CI and release safety

- Removed every command that printed `.npmrc` and stopped copying credentials into nonexistent workspaces.
- Registry credentials are gated to main/develop and materialized as `.npmrc` only after validation and versioning; the copy is removed after the publish attempt.
- CI uses the declared Node/Yarn versions and runs full validation plus a clean-tree check before versioning or publishing.
- Feature branches no longer receive registry credentials or mirror repositories.
- Removed the branch-name shell injection path, stopped embedding credentials in Git URLs, and moved mirroring after the released commit/tags are pushed.
- Develop now creates real `alpha` prerelease versions, main graduates prereleases, and Lerna publishes through a temporary dist-tag.
- Removed the publish-recovery script that converted registry failures into success.
- Publishing remains outside validation; no package, tag, or credential was published or exposed during this work.

### Dependencies and tooling

- Aligned React/ReactDOM on the React 19.2 line and added direct Testing Library dependencies.
- Aligned Next 16.0.7 with ESLint 9 and `eslint-config-next` 16.0.7.
- Kept Storybook on its compatible 8.6 line and Vite on its compatible 6.x line.
- Updated TypeScript to 5.9, Lerna to 8.2, and icon tooling to Rollup 4.
- Replaced deprecated Babel proposal plugins with transform plugins and removed unused Webpack-era loaders.
- Moved runtime imports such as `@progressiveui/icons-react` into runtime dependencies.
- Removed the stale npm v5 lockfile from the Yarn-managed styles workspace.

### React 19 testing and TypeScript

- Active Jest setup uses Testing Library and never initializes the React 16 Enzyme adapter.
- Migrated ModalWrapper and Tab suites to TypeScript Testing Library tests with awaited `userEvent` calls.
- Active result is 11 suites, 78 tests, and 4 snapshots.
- Split production, declaration, test, Storybook, and legacy TypeScript configs. `allowJs` is false by default and enabled only at explicit declaration/Storybook/legacy boundaries.
- The shipped public API type-check passes; broad historical implicit-`any` debt remains documented rather than hidden in that check.
- Fixed React 19 typing for Button, ModalWrapper, PasswordInput, Text, Avatar, shared SVG data, and text kinds without changing rendered classes or behavior.

### Builds, declarations, and package exports

- React emits native `index.mjs` and `index.cjs`; deterministic `.es.js`/`.cjs.js` aliases preserve existing paths.
- React and ReactDOM subpaths are externalized. The UMD build uses the classic JSX transform so browser consumers need React and ReactDOM globals, not a nonexistent `ReactJSXRuntime` global.
- Declaration output excludes tests, stories, `othersrc`, old, and legacy paths and includes the shared utility types required by consumers.
- Public declarations no longer leak a dev-only `react-hook-form` type; `prop-types` and its types are declared package dependencies because exported declarations reference them.
- Separated website metadata generation from library declaration generation and removed recursive duplicate parsing.
- Added conditional root exports plus compatibility wildcard exports for JavaScript packages and explicit Sass/CSS/token exports for asset packages.
- Added strict ESM/CommonJS/UMD smoke tests, TypeScript declaration consumption, a frozen public-export fixture, and bundle-size regression checks.

### Website, tokens, icons, and legacy isolation

- Migrated Algolia UI imports to React InstantSearch 7 and removed the obsolete dual instantsearch packages.
- Removed unused/mismatched `@next/mdx`, MDX loader, and MDX runtime integration while retaining `next-mdx-remote` for active content.
- Added an ESLint 9 flat config and fixed browser-global sample evaluation for server rendering.
- Storybook imports legacy component README files as raw Markdown, removes a stale Footer story reference, and now completes its production build.
- Local token generation rebuilds the default output from checked-in sources. The tracked legacy dark artifact remains byte-stable; remote token synchronization remains a separate credentialed command.
- Icon generation awaits conversion/bundling, exits deterministically, externalizes React, emits native ESM and declaration files, and keeps legacy file paths.
- Published package manifests include license files and package-specific ESM/CommonJS usage examples.
- Added `packages/react/LEGACY.md`; no legacy implementation or compatibility dependency was removed.

## Compatibility decisions

- Runtime public exports remain exactly the baseline 127 names.
- Existing React `.es.js` and `.cjs.js` entry files remain available alongside native extensions.
- Package wildcard exports retain deep-path access while consumers migrate to documented root exports.
- Component markup, CSS class names, tokens, and styling were not intentionally changed.
- `Text` now accepts the already-rendered `story-title` and `story-subtitle` kinds in its public type.
- Enzyme, Redux Form, React Table v7, React Dates, and other React 16-era example dependencies remain isolated because removing them would require migrations and compatibility evidence.
- Style Dictionary stays on v3.9.2. Its v4 API migration is deferred to a token-fixture-focused pull request.
- Node 22 is the repository and CI toolchain policy, not a new runtime floor for the browser-only styles, themes, or icon packages. Existing React peer ranges remain compatible.

## Deferred work and risks

- Migrate the remaining 65 Enzyme-dependent JavaScript suites before removing Enzyme or its React 16 adapter.
- Fix Modal prop forwarding warnings under React 19 in a behavior-focused change.
- Resolve the 69 React lint warnings and 24 website lint warnings before making warning budgets zero.
- Replace Redux Form/React Dates/React Table v7 examples, then remove their incompatible peer trees.
- Migrate Style Dictionary v3 to v4 with golden default/dark token artifacts.
- Repair the dark-token source/parser mapping before enabling local dark regeneration; the current source would change public names and values.
- Enable `noImplicitAny` incrementally across shipped components. It remains disabled in the base configuration because a strict probe still reports roughly 120–130 active-source diagnostics.
- Update deprecated Sass `if()` syntax; current CSS is +12,929 bytes raw (+4.8%) and +1,975 bytes gzip (+5.3%) versus baseline because current Sass/token output is now used.
- Review Next/React Compiler warnings around effects, refs, and React Hook Form without folding runtime behavior changes into tooling work.
- The authenticated Azure token-sync path and registry publish path were intentionally not executed.
- CSS selector/custom-property and token name/value semantic fixtures are still needed; export and bundle checks alone do not prove those contracts.

## Final validation

Final command results are recorded here only after execution. See the closing task report and the repository history for the exact Conventional Commits.
