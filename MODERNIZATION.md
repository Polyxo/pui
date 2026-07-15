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
- Reduced Yarn and Lerna workspace scope to the real `packages/*` workspaces.
- Made root type-check and test commands generate the token, demo, and icon inputs they consume, so they no longer depend on ignored output from an earlier build.
- Removed a root command that referenced an ignored, machine-specific update script, and aligned React's `clean` command with its current `dist` output.

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
- Vite is the canonical React package build. The older direct Rollup command remains available for compatibility investigation but is not part of validation.

### Website, tokens, icons, and legacy isolation

- Migrated Algolia UI imports to React InstantSearch 7 and removed the obsolete dual instantsearch packages.
- Removed unused/mismatched `@next/mdx`, MDX loader, and MDX runtime integration while retaining `next-mdx-remote` for active content.
- Added an ESLint 9 flat config and fixed browser-global sample evaluation for server rendering.
- Kept Next's development and production commands on explicit Webpack mode; Turbopack migration is deferred until the custom Sass/content pipeline has dedicated compatibility coverage.
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

- Migrate the remaining 64 Enzyme-dependent JavaScript suites before removing Enzyme or its React 16 adapter. There are 66 quarantined `*-test.js` suites in total; two `othersrc` suites already use Testing Library.
- Fix Modal prop forwarding warnings under React 19 in a behavior-focused change.
- Resolve the 69 React lint warnings and 24 website lint warnings before making warning budgets zero.
- Replace Redux Form/React Dates/React Table v7 examples, then remove their incompatible peer trees.
- Migrate Style Dictionary v3 to v4 with golden default/dark token artifacts.
- Repair the dark-token source/parser mapping before enabling local dark regeneration; the current source would change public names and values.
- Enable `noImplicitAny` incrementally across shipped components. It remains disabled in the base configuration because a strict probe still reports roughly 120–130 active-source diagnostics.
- Remove the remaining JavaScript production boundary incrementally. Declaration/build configs still use `allowJs: true` with JavaScript checking disabled, the website uses `strict: false`, and Storybook is outside the root type-check.
- Update deprecated Sass `if()` syntax. Current CSS is byte-identical raw (271,808 bytes) and 72 bytes larger gzip (37,164 bytes, +0.2%) versus baseline.
- Review Next/React Compiler warnings around effects, refs, and React Hook Form without folding runtime behavior changes into tooling work.
- The authenticated Azure token-sync path, Azure pipeline release path, registry publish path, and version/tag commands were intentionally not executed. Local shell syntax checks are not a substitute for a real pipeline run.
- CSS selector/custom-property and token name/value semantic fixtures are still needed; export and bundle checks alone do not prove those contracts.
- Remove or formally isolate the redundant direct Rollup React build after downstream consumers confirm Vite output is sufficient.

## Final validation

Validation used a detached worktree created without `node_modules`. `yarn install --frozen-lockfile` passed there in 35.53 seconds. The install retained warnings from React 16-era development dependencies, but did not change the lockfile.

The first clean `yarn validate` attempt caught two hidden generated-artifact dependencies before the final pass:

1. Website type-checking required ignored token JSON and demo-bundle output. Root `typecheck` now generates those exact inputs first, and the unsafe website `*.json => string` fallback was removed.
2. Three Jest suites required the ignored `@progressiveui/icons-react` runtime build. Root `test` now builds icon tooling and the React icon package first.

These clean-check failures were fixed and are not present in the final result. The final detached-worktree `yarn validate` exited 0 in 183.80 seconds.

| Check | Final result |
| --- | --- |
| `yarn install --frozen-lockfile` | Passed from a checkout with no `node_modules`; expected legacy peer warnings remain. |
| `yarn lint` | Passed with 0 errors; 69 React warnings and 24 website warnings remain recorded debt. |
| `yarn typecheck` | Passed for the shipped React surface and website after deterministic token/demo generation. |
| `yarn test` | Passed: 11 suites, 78 tests, and 4 snapshots. React 19 reports known Modal DOM-prop warnings. |
| `yarn build:packages` | Passed, including default tokens, Sass/CSS, icon tooling, 81 React icons, and the Vite React package build. |
| `yarn build:storybook` | Passed. Sass deprecations, an inactive MDX glob, and Storybook's eval warning remain non-fatal. |
| `yarn build:website` | Passed in explicit Webpack mode and generated 154 static pages. Sass, legacy content-parser, and sample-code warnings remain non-fatal. |
| `yarn verify:packages` | Passed: 127 React exports, 81 icon exports, and 282 declaration files; the legacy ESM alias triggers Node's typeless-package warning. |
| `yarn verify:packed-packages` | Passed from five tarballs installed into an isolated npm consumer with blank npm configs and the public registry. ESM, CommonJS, UMD, Sass, and strict TypeScript consumption passed. |
| `yarn verify:public-exports` | Passed: the React runtime surface remains exactly 127 baseline exports. |
| `yarn verify:bundle-size` | Passed all thresholds. Exact results are listed below. |
| `yarn verify:clean` | Passed after all generators and builds; no tracked generated changes remained. |

Packed output contained 311 files / 2,853,819 bytes for React (baseline: 400 files / about 3.77 MB), 9 / 390,094 for icons-react, 7 / 51,478 for icons-core, 267 / 920,591 for styles, and 26 / 1,054,905 for themes-core.

Final bundle comparison:

| Artifact | Raw bytes (delta) | Gzip bytes (delta) |
| --- | ---: | ---: |
| React CommonJS | 130,829 (-62,337) | 39,413 (-18,291) |
| React ESM | 187,498 (-92,413) | 46,784 (-22,601) |
| React UMD | 130,136 (-61,951) | 39,368 (-18,180) |
| Icons ESM | 115,725 (-61,128) | 32,396 (-14,289) |
| Icons UMD | 122,374 (-59,984) | 33,137 (-13,878) |
| Styles CSS | 271,808 (+0) | 37,164 (+72) |

## Recommended follow-up pull requests

1. Migrate Enzyme suites component-by-component to Testing Library, starting with active exported components; remove the React 16 adapter only after the final suite moves.
2. Tighten public JavaScript, website, and Storybook TypeScript boundaries, then enable `noImplicitAny` in small ownership-based slices.
3. Replace Redux Form, React Dates, and React Table v7 examples and compatibility wrappers before removing their dependency trees.
4. Add golden light/dark token, custom-property, selector, and CSS fixtures; then migrate Style Dictionary v3 to v4 and modernize deprecated Sass syntax.
5. Resolve React 19 DOM-prop and React Compiler warnings with behavior-specific tests.
6. Evaluate Turbopack for the website and retire the redundant React Rollup build only with downstream and bundle evidence.
7. Exercise the hardened Azure validation/version/publish flow in a non-production dry-run pipeline without registry publication.
