# Modernization record

Audit date: 2026-07-15

Branch: `chore/modernize-monorepo`

Baseline: `b662910f3` (`feat/april-release`)
Baseline validation runtime: Node 24.0.2 and Yarn 1.22.22; CI target at the
start of the audit: Node 22 and Yarn 1.22.22.

The work started with uncommitted Sass and `sass-loader` updates in the React and website manifests plus their lockfile changes. Those edits were preserved and adopted into the modernization dependency commit.

## Baseline results

These results were recorded before modernization changes. A failed command is not treated as a regression unless it worked here.

| Check                            | Baseline result                                                                                                                                  |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `yarn install --frozen-lockfile` | Passed after network access was allowed; peer warnings exposed React 19/React 16-era dependency conflicts.                                       |
| Root `yarn build`                | Did not complete. `icons-core` generated output but its Rollup process stayed alive and was interrupted.                                         |
| React Jest                       | Failed: 7 suites passed, 2 suites failed to compile; 46 tests and 3 snapshots passed. Failures were Button event typing and a stale Footer prop. |
| React `tsc --noEmit`             | Failed with 82 diagnostics in 42 files, mixing public source, Storybook, tests, `othersrc`, casing problems, and React 19 type changes.          |
| React package build              | Passed in 137.09 s but printed declaration diagnostics. ESM/CJS/UMD were 279,911/193,166/192,087 bytes.                                          |
| Storybook production build       | Failed while Vite parsed `src/components/Checkbox/README.mdx` as a module.                                                                       |
| Website type-check               | Passed.                                                                                                                                          |
| Website lint                     | Failed because Next 16 no longer implements `next lint`.                                                                                         |
| Website production build         | Passed on the network-enabled retry with Sass, MDX/runtime, Prettier plugin, and mismatched Next/MDX warnings.                                   |
| Icon React build                 | Passed and generated 81 icons.                                                                                                                   |
| Local token generation           | Passed. Authenticated `build:tokens` was not run because it synchronizes from Azure and requires `GIT_ACCESS_TOKEN`.                             |

Baseline package facts:

- React exposed the same 127 runtime names in its generated formats.
- React declarations included tests, stories, old files, and legacy files.
- The React package tarball contained 400 files (about 3.77 MB).
- React baseline gzip sizes were 69,385 bytes ESM, 57,704 bytes CJS, and 57,548 bytes UMD.
- Icon baseline gzip sizes were 46,685 bytes ESM and 47,015 bytes UMD.
- CSS baseline was 271,808 bytes raw and 37,092 bytes gzip.

## Implemented changes (2026-07-15)

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

## Compatibility decisions recorded 2026-07-15

- Runtime public exports remain exactly the baseline 127 names.
- Existing React `.es.js` and `.cjs.js` entry files remain available alongside native extensions.
- Package wildcard exports retain deep-path access while consumers migrate to documented root exports.
- Component markup, CSS class names, tokens, and styling were not intentionally changed.
- `Text` now accepts the already-rendered `story-title` and `story-subtitle` kinds in its public type.
- Enzyme, Redux Form, React Table v7, React Dates, and other React 16-era example dependencies remain isolated because removing them would require migrations and compatibility evidence.
- Style Dictionary stays on v3.9.2. Its v4 API migration is deferred to a token-fixture-focused pull request.
- Node 22 was the repository and CI toolchain policy at this stage, not a new
  runtime floor for the browser-only styles, themes, or icon packages. The
  repository policy was superseded by the Node 24 follow-up below; existing
  React peer ranges remain compatible.

## Deferred work and risks recorded 2026-07-15

- At this point, 64 Enzyme-dependent JavaScript suites remained out of 66
  quarantined `*-test.js` suites; two `othersrc` suites already used Testing
  Library.
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

## Final validation for the 2026-07-15 stage

Validation used a detached worktree created without `node_modules`. `yarn install --frozen-lockfile` passed there in 35.53 seconds. The install retained warnings from React 16-era development dependencies, but did not change the lockfile.

The first clean `yarn validate` attempt caught two hidden generated-artifact dependencies before the final pass:

1. Website type-checking required ignored token JSON and demo-bundle output. Root `typecheck` now generates those exact inputs first, and the unsafe website `*.json => string` fallback was removed.
2. Three Jest suites required the ignored `@progressiveui/icons-react` runtime build. Root `test` now builds icon tooling and the React icon package first.

These clean-check failures were fixed and are not present in the final result. The final detached-worktree `yarn validate` exited 0 in 183.80 seconds.

| Check                            | Final result                                                                                                                                                                          |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `yarn install --frozen-lockfile` | Passed from a checkout with no `node_modules`; expected legacy peer warnings remain.                                                                                                  |
| `yarn lint`                      | Passed with 0 errors; 69 React warnings and 24 website warnings remain recorded debt.                                                                                                 |
| `yarn typecheck`                 | Passed for the shipped React surface and website after deterministic token/demo generation.                                                                                           |
| `yarn test`                      | Passed: 11 suites, 78 tests, and 4 snapshots. React 19 reports known Modal DOM-prop warnings.                                                                                         |
| `yarn build:packages`            | Passed, including default tokens, Sass/CSS, icon tooling, 81 React icons, and the Vite React package build.                                                                           |
| `yarn build:storybook`           | Passed. Sass deprecations, an inactive MDX glob, and Storybook's eval warning remain non-fatal.                                                                                       |
| `yarn build:website`             | Passed in explicit Webpack mode and generated 154 static pages. Sass, legacy content-parser, and sample-code warnings remain non-fatal.                                               |
| `yarn verify:packages`           | Passed: 127 React exports, 81 icon exports, and 282 declaration files; the legacy ESM alias triggers Node's typeless-package warning.                                                 |
| `yarn verify:packed-packages`    | Passed from five tarballs installed into an isolated npm consumer with blank npm configs and the public registry. ESM, CommonJS, UMD, Sass, and strict TypeScript consumption passed. |
| `yarn verify:public-exports`     | Passed: the React runtime surface remains exactly 127 baseline exports.                                                                                                               |
| `yarn verify:bundle-size`        | Passed all thresholds. Exact results are listed below.                                                                                                                                |
| `yarn verify:clean`              | Passed after all generators and builds; no tracked generated changes remained.                                                                                                        |

Packed output contained 311 files / 2,853,819 bytes for React (baseline: 400 files / about 3.77 MB), 9 / 390,094 for icons-react, 7 / 51,478 for icons-core, 267 / 920,591 for styles, and 26 / 1,054,905 for themes-core.

Final bundle comparison:

| Artifact       | Raw bytes (delta) | Gzip bytes (delta) |
| -------------- | ----------------: | -----------------: |
| React CommonJS | 130,829 (-62,337) |   39,413 (-18,291) |
| React ESM      | 187,498 (-92,413) |   46,784 (-22,601) |
| React UMD      | 130,136 (-61,951) |   39,368 (-18,180) |
| Icons ESM      | 115,725 (-61,128) |   32,396 (-14,289) |
| Icons UMD      | 122,374 (-59,984) |   33,137 (-13,878) |
| Styles CSS     |      271,808 (+0) |       37,164 (+72) |

## Recommended follow-up pull requests recorded 2026-07-15

1. Migrate Enzyme suites component-by-component to Testing Library, starting with active exported components; remove the React 16 adapter only after the final suite moves.
2. Tighten public JavaScript, website, and Storybook TypeScript boundaries, then enable `noImplicitAny` in small ownership-based slices.
3. Replace Redux Form, React Dates, and React Table v7 examples and compatibility wrappers before removing their dependency trees.
4. Add golden light/dark token, custom-property, selector, and CSS fixtures; then migrate Style Dictionary v3 to v4 and modernize deprecated Sass syntax.
5. Resolve React 19 DOM-prop and React Compiler warnings with behavior-specific tests.
6. Evaluate Turbopack for the website and retire the redundant React Rollup build only with downstream and bundle evidence.
7. Exercise the hardened Azure validation/version/publish flow in a non-production dry-run pipeline without registry publication.

## Follow-up audit and implementation — 2026-07-16

This section records the next reviewable batch. It supersedes current-state
version, test-count, and deferred-work statements above without rewriting the
historical baseline or its clean validation evidence.

### Changes implemented

#### Agent guidance, CI, and security

- Expanded `AGENTS.md` into a repository-specific operating guide and added the
  architecture, generation, validation, package-contract, legacy, secret, and
  remote-side-effect maps under `docs/architecture`.
- Adopted Node 24 as the repository build policy in `.nvmrc`, root and website
  engines, Node types, and Azure. CI now selects `ubuntu-24.04`, fetches complete
  history and tags, and keeps checkout credentials disabled. Yarn remains
  1.22.22.
- Split broad local feedback into `yarn validate:quick` and the full
  `yarn validate:release`; `yarn validate` remains the stable release-equivalent
  alias used before versioning or publishing.
- Added a security policy and weekly family-scoped Dependabot groups for minor
  and patch updates. Major updates remain separate, review-required pull
  requests rather than being mixed into those groups.
- Added an immutable tag-and-digest-pinned OSV-Scanner 2.3.8 CI report. The
  current lockfile still has known findings, so this step must remain report-only
  until a reviewed baseline or remediation policy can make it a reliable gate.
  It is not documented as a passing vulnerability gate.
- No package publish, version, tag, mirror, token synchronization, or Algolia
  write was run. No registry or search credential was printed.

#### Dependencies and website

- Aligned Next and `eslint-config-next` at exact version 16.2.10 and migrated the
  active content renderer to `next-mdx-remote` 6. The website now uses TypeScript
  bundler resolution as required by the updated Next toolchain.
- Removed unused website packages including Axios, `next-seo`,
  `react-render-html`, and inactive remark/hast integrations after checking local
  imports.
- Updated selected Babel packages, Node types, Handlebars, PostCSS, and the
  icon-core SVGO line rather than applying unbounded major upgrades.
- Adapted live MDX code blocks to MDX 6 node-shaped children and Prettier 3's
  asynchronous formatter. Formatting now updates state without assigning a
  `Promise` to rendered code and falls back to the original source on failure.
- Deleted the two unauthenticated website API routes that could mutate the
  Algolia index. The remaining administrative script has an offline dry run,
  validates record IDs and non-empty input, requires the explicit
  `ALGOLIA_INDEX_WRITE=update-ui-docs` confirmation plus server-side credentials,
  and replaces the index atomically.

#### React behavior and legacy migration

- Repaired Modal and ModalWrapper behavior under React 19: external open/close
  callbacks fire once, Escape closes with the key reason, opted-in Enter submits,
  focus returns to native and legacy `inputref` custom triggers, internal
  configuration props no longer leak to the DOM, and modal element refs use
  their real element types.
- Replaced the Hero Enzyme suite with a TypeScript Testing Library suite before
  removing it. The implementation now makes the existing `href`-before-`url`
  behavior explicit instead of relying on DOM spread order, and related-card
  images receive derived or explicit alternative text.
- Removed a shipped Slider debug log.
- No legacy implementation was removed. The quarantine now contains 65
  JavaScript `*-test.js` suites, of which 63 import Enzyme; the two exceptions are
  Testing Library suites under `othersrc`. There are 13 active TypeScript Jest
  suites.

### Compatibility decisions

- Node 24 is the contributor, build, website, and CI policy (`>=24 <25`). This
  does not add a Node engine to the published browser-oriented packages or alter
  their React peer ranges.
- No root export name, compatibility alias, CSS class, token, or icon name was
  intentionally changed in this batch. The final public-export and packed-package
  checks passed before handoff.
- `Hero.imageAlt` is additive. Existing `href` callers retain precedence over the
  `url` compatibility fallback.
- Modal changes correct callback, keyboard, focus, and invalid-DOM-prop behavior;
  they do not intentionally change its CSS classes or public export.
- The TypeScript legacy boundary was not widened. New production and test code is
  TypeScript; `allowJs` remains confined to the documented compatibility configs.
- Enzyme and its React 16 adapter, Redux Form, React Dates, and React Table v7
  remain installed until their remaining references have behavior-equivalent
  migrations.
- Vite 6, Rollup 4, Storybook 8, Style Dictionary 3, Webpack-mode Next builds,
  token names and values, and icon generation formats remain unchanged by this
  follow-up.

### Validation evidence for this follow-up

The exact final code commit (`ec3e9b278`) was validated from the detached clean
worktree used for the follow-up. A fresh `yarn install --frozen-lockfile` passed
there in 33.77 seconds with the expected legacy peer warnings. The final
network-enabled `yarn validate` exited 0 in 169.68 seconds. Network access was
needed only when the packed-package verifier installed public consumer
dependencies; no private registry or release credential was used.

| Check                                  | Result recorded 2026-07-16                                                                                                           |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `yarn install --frozen-lockfile`       | Passed from a checkout without `node_modules` in 33.77 seconds; expected legacy peer warnings remain.                                |
| Algolia `search:index:check`           | Passed offline and validated 150 records; no remote write or credential was used.                                                    |
| Focused Hero/Modal/ModalWrapper suites | Passed after compatibility review: 3 suites and 18 tests.                                                                            |
| `yarn lint`                            | Passed with 0 errors; 65 React warnings and 22 website warnings remain recorded debt.                                                |
| `yarn typecheck`                       | Passed for the shipped React surface and website after deterministic token/demo generation.                                          |
| `yarn test`                            | Passed: 13 suites, 91 tests, and 4 snapshots. Quarantined JavaScript suites remained excluded.                                       |
| `yarn build:packages`                  | Passed, including default tokens, Sass/CSS, icon tooling, 81 React icons, and the Vite React package build.                          |
| `yarn build:storybook`                 | Passed with 705 transformed modules. Existing Sass, empty-story-glob, and Storybook eval warnings remain non-fatal.                  |
| `yarn build:website`                   | Passed with Next 16.2.10 in Webpack mode and generated 154 static pages. Existing Sass, Figma, metadata, and sample warnings remain. |
| `yarn verify:packages`                 | Passed: 127 React exports, 81 icon exports, and 282 declaration files.                                                               |
| `yarn verify:packed-packages`          | Passed from five tarballs in an isolated consumer: ESM, CommonJS, UMD, compiled Sass, and strict TypeScript.                         |
| `yarn verify:public-exports`           | Passed: the React runtime surface remains exactly 127 baseline exports.                                                              |
| `yarn verify:bundle-size`              | Passed every configured threshold; exact results are listed below.                                                                   |
| `yarn verify:clean`                    | Passed after all generators and builds; no tracked generated changes remained.                                                       |

Packed output contained 311 files / 2,868,125 bytes for React, 9 / 390,094 for
icons-react, 7 / 51,478 for icons-core, 267 / 920,591 for styles, and 26 /
1,054,905 for themes-core.

| Artifact       | Raw bytes (delta) | Gzip bytes (delta) |
| -------------- | ----------------: | -----------------: |
| React CommonJS | 131,798 (-61,368) |   39,815 (-17,889) |
| React ESM      | 188,593 (-91,318) |   47,227 (-22,158) |
| React UMD      | 131,105 (-60,982) |   39,766 (-17,782) |
| Icons ESM      | 115,725 (-61,128) |   32,396 (-14,289) |
| Icons UMD      | 122,374 (-59,984) |   33,137 (-13,878) |
| Styles CSS     |      271,808 (+0) |       37,164 (+72) |

### Failures and regressions encountered

- A website type-check immediately after upgrading Next read stale `.next` type
  metadata and failed on `PrefetchForTypeCheckInternal`. Regenerating the Next
  output removed that stale-state failure.
- The first sandboxed website build could not fetch Google Fonts because network
  access was unavailable. The network-enabled retry reached compilation; this
  was an environment failure, not counted as a passing build.
- The first Next 16.2.10/MDX 6 production build then failed while prerendering
  `/how-tos/write-documentation` because the live code block assumed MDX children
  were always strings and because Prettier 3 returns a promise. The recursive
  text normalization and asynchronous formatting change fixed that regression;
  the subsequent production build passed.
- Yarn Classic's registry audit endpoint returned HTTP 410, so `yarn audit` did
  not provide usable evidence. The OSV scan ran instead and correctly exited
  nonzero for known findings.
- The first complete follow-up validation from the long-lived local install
  failed during icon generation because a stale nested Babel helper resolved
  the root `lru-cache` 10 instead of its locked `lru-cache` 5 dependency.
  `yarn install --frozen-lockfile --force` did not remove that orphaned nested
  directory. The fresh worktree install had the lockfile-correct tree, passed
  icon generation, and passed the complete release gate; this was local install
  drift rather than a lockfile regression.
- A sandboxed final-gate rerun reached the isolated packed-package consumer but
  its public `npm install` remained idle in blocked DNS retries. That attempt was
  interrupted and rerun with public-registry network access; the exact same
  commit then passed the packed consumer and complete gate. No private registry
  access was attempted.
- The initial OSV inventory contained 59 affected package-version entries, 38
  package names, 113 advisories, and 114 unique package-name/advisory pairs.
  After selected updates and the final MDX upgrade, the report contains 53
  affected package-version entries across 32 package names, 61 advisories, and
  62 unique package-name/advisory pairs. By unique advisory, 4 are critical, 31
  high, 21 medium, and 5 low. OSV correctly exits nonzero; no clean security
  result is claimed.

### Remaining risks and recommended pull requests

1. Triage the final OSV report by direct owner and runtime reachability. Remediate
   safe parent upgrades in focused pull requests, document unavoidable legacy
   development-only findings, and make CI blocking only when its baseline policy
   cannot create false regressions.
2. Migrate the remaining 63 Enzyme suites component-by-component, preserving
   behavior, markup, classes, and focus/accessibility evidence before removing
   Enzyme or the React 16 adapter.
3. Tighten TypeScript by shipped-source ownership: remove remaining JavaScript
   production boundaries, enable `noImplicitAny` in small slices, and make the
   website strict without hiding errors behind generated output or blanket
   exceptions.
4. Replace Redux Form, React Dates, and React Table v7 examples and wrappers in
   dedicated compatibility migrations.
5. Consolidate React build/declaration ownership only after API and declaration
   fixtures prove Vite can replace the retained direct Rollup path. Evaluate API
   Extractor or equivalent signature reports separately from runtime export-name
   checks.
6. Add golden light/dark token, selector, custom-property, icon, and generated
   cleanliness fixtures before Style Dictionary 4 or broad Sass modernization.
7. Address remaining React/website lint, React Compiler, Sass, and content-parser
   warnings with ownership-specific budgets. Keep Next on Webpack, Storybook on
   8, and Vite on 6 until dedicated migration evidence exists.
8. Add accessibility and visual-regression coverage for stable component stories,
   and consider `publint`, package-attestation checks, and dead-code analysis as
   independent, reviewable gates.
9. Rehearse Azure validation/version/publish ordering in a non-production
   pipeline. Moving registry access to workload identity or another short-lived
   credential mechanism requires release-owner and infrastructure coordination.

## OSV inventory remediation — 2026-07-16

This section supersedes the report-only OSV status and security follow-up item
above. It does not rewrite those earlier observations because they remain the
baseline for this remediation.

### Baseline and triage

OSV-Scanner 2.3.8 reproduced the requested inventory from the pre-remediation
`yarn.lock`: 53 affected package versions across 32 package names and 61 GHSA
advisory IDs. The scanner groups contained 4 critical, 31 high, 21 medium, and 5
low findings. The critical paths were `form-data` through Jest 29/jsdom 20,
Handlebars through Lerna's changelog tooling, and Locutus through the unused Twig
compiler dependency.

No critical/high finding was imported by the published React browser runtime.
The inventory was not entirely development-only: Style Dictionary dependencies
used by the published themes builder and SVGO/matching dependencies used by the
published icon generator were affected. Those build APIs were therefore treated
as published compatibility surfaces and retained their token/icon validation.

The measured progression was:

| Stage                                             | Affected versions | Package names | Advisory IDs | Scanner result                                    |
| ------------------------------------------------- | ----------------: | ------------: | -----------: | ------------------------------------------------- |
| Reproduced baseline                               |                53 |            32 |           61 | Failed, as expected                               |
| Lerna/Jest upgrades and unused dependency removal |                39 |            24 |           41 | Failed, remaining exact and stale lock selections |
| Compatible transitive refresh                     |                 8 |             7 |           10 | Failed, exact parent constraints only             |
| Scoped resolutions and final lockfile             |                 0 |             0 |            0 | Passed                                            |

### Remediation and compatibility decisions

- Upgraded Lerna 8.2.4 to 9.0.7. The repository does not use the removed legacy
  `bootstrap`, `add`, or `link` commands; `lerna list --all` still discovers all
  seven workspaces. Version and publish commands were not run.
- Upgraded Jest 29.7, `jest-environment-jsdom` 29.7, and Jest types 29 to their
  30.4/30.0 lines. `ts-jest` 29.4 remains because its declared peer range supports
  Jest 29 and 30. jsdom now normalizes the named color `red` to its equivalent RGB
  value, so one Wrapper assertion now checks that normalized representation.
  Jest also refreshed only the URL in four snapshot headers; rendered snapshots
  did not change.
- Removed direct development dependencies `twig` and `pretty` after repository
  import searches and `yarn why` showed no active consumers. Existing `.twig`
  fixtures and quarantined `othersrc` material remain untouched. Removing Twig
  removed Locutus rather than forcing Twig 1 across Locutus's major boundary.
- Refreshed only OSV-affected compatible lock entries. The declaration subtree
  moved API Extractor 7.52.8 to 7.58.10 inside `vite-plugin-dts`' existing
  `^7.50.1` request. This removed its constrained Ajv, Lodash, and Minimatch
  versions without changing the public declaration workflow.
- Kept multiple major lines of packages such as Minimatch and Picomatch. No
  global flattening resolution was introduced.

Four exact-owner resolutions remain because the current parent releases do not
request a patched version. Yarn's four incompatible-resolution warnings are
expected and are not hidden:

| Resolution                                  | Parent request                  | Why it is scoped/safe                                                                       | Required evidence and removal trigger                                                                                              |
| ------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `lerna/js-yaml` → 4.2.0                     | Lerna 9.0.7 pins 4.1.1          | Same major; release-configuration parsing only                                              | Lerna CLI/list plus full validation; remove when Lerna requests at least 4.2.0                                                     |
| `lerna/tar` → 7.5.20                        | Lerna 9.0.7 pins 7.5.11         | Same major; release/package tooling only                                                    | Lerna CLI/list plus package validation; remove when Lerna requests at least 7.5.16                                                 |
| `**/next/postcss` → 8.5.19                  | Next 16.2.10 pins 8.4.31        | Same major; limited to the website CSS build                                                | Website production build; remove when Next requests at least 8.5.10                                                                |
| `**/@storybook/addon-actions/uuid` → 11.1.1 | Addon Actions requests `^9.0.0` | Development-only addon imports the retained `v4` API; this is the only cross-major override | Storybook production/action smoke evidence; remove when the addon requests at least 11.1.1 or during a dedicated Storybook upgrade |

Review these resolutions on every Lerna, Next, or Storybook dependency update and
no later than 2026-08-16. A resolution may be removed only when a frozen install
and OSV scan remain clean without it.

### Security gate and agent workflow

- Added `yarn security:scan` as the first release-equivalent validation command.
  It runs OSV-Scanner 2.3.8 from a digest-pinned container or an explicitly pinned
  local binary and fails on any finding.
- The wrapper always scans `yarn.lock`; callers may request JSON output but cannot
  replace the scan command, provide an ignore configuration, or request help in
  place of the gate. The container receives only a read-only `yarn.lock` mount,
  not source files, `.env`, or `.npmrc`.
- Removed Azure's report-only `continueOnError` behavior. The blocking scan now
  runs inside `yarn validate` before any version, secure-file, or publish step.
- Expanded `AGENTS.md` and the validation map with direct-owner triage, Yarn
  Classic lock-refresh limitations, scoped-resolution rules, and the exact scan
  command. No ignore list or accepted vulnerability baseline was added.

### Validation evidence and encountered failures

Before the final clean-checkout run, the new OSV wrapper exited 0 and reported
`No issues found`; Lerna 9.0.7 version/list checks, root lint, root type-checking,
and the focused Jest 30 Wrapper suite also exited 0. Lint retained 65 React and
13 website warnings with zero errors. Type-checking regenerated tokens and demo
assets successfully.

Two non-passing working-copy attempts are recorded separately from regressions:

- A direct React workspace test did not generate the ignored icons package first,
  so four suites could not resolve it. The root `yarn test` command owns that
  prerequisite.
- The root test retry then stopped during icon generation on the already-recorded
  stale nested Babel/`lru-cache` directory in the long-lived `node_modules` tree.
  No tests ran in that attempt. Final release evidence must come from a fresh
  frozen installation, not this drifted local tree.

The exact code/documentation commit `a6cdb9511` was then validated from a detached
worktree with no existing `node_modules`. `yarn install --frozen-lockfile` exited
0 in 26.67 seconds and left the checkout clean. With
`OSV_SCANNER_BIN=/private/tmp/osv-scanner` pointing to the verified 2.3.8 binary,
`yarn validate` exited 0 in 186.83 seconds. Public network access was used for
OSV queries and the isolated packed-package consumer; no private registry or
release credential was used.

| Check                                            | Result recorded 2026-07-16                                                                                              |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `yarn security:scan`                             | Passed; OSV scanned 2,016 locked package versions and reported no issues                                                |
| `yarn lint`                                      | Passed with 0 errors; 65 React warnings and 13 website warnings remain recorded debt                                    |
| `yarn typecheck`                                 | Passed for React's shipped surface and the website after token/demo generation                                          |
| `yarn test`                                      | Passed: 13 suites, 91 tests, and 4 snapshots; quarantined JavaScript suites remain excluded                             |
| `yarn build:packages`                            | Passed, including tokens, Sass/CSS, icon tooling, 81 generated icons, declarations, and the Vite React build            |
| `yarn build:storybook`                           | Passed with 710 transformed modules; existing Sass, inactive-glob, and Storybook eval warnings remain                   |
| `yarn build:website`                             | Passed in Next 16.2.10 Webpack mode and generated 154 static pages; existing Sass/Figma/metadata/sample warnings remain |
| `yarn verify:packages`                           | Passed: 127 React exports, 81 icon exports, and 282 declaration files                                                   |
| `yarn verify:packed-packages`                    | Passed in an isolated consumer for ESM, CommonJS, UMD, compiled Sass, and strict TypeScript                             |
| `yarn verify:public-exports`                     | Passed; the React root surface remains exactly 127 baseline names                                                       |
| `yarn verify:bundle-size`                        | Passed every configured raw and gzip threshold; exact output is below                                                   |
| `yarn verify:clean`                              | Passed after all generators and builds; the detached worktree remained clean                                            |
| `yarn lerna --version` / `yarn lerna list --all` | Passed with Lerna 9.0.7 and all seven workspaces; no version or publish command was run                                 |

Packed output contained 311 files / 2,867,326 bytes for React, 9 / 390,094 for
icons-react, 7 / 51,478 for icons-core, 267 / 920,591 for styles, and 26 /
1,054,905 for themes-core.

| Artifact       | Raw bytes (baseline delta) | Gzip bytes (baseline delta) |
| -------------- | -------------------------: | --------------------------: |
| React CommonJS |          131,790 (-61,376) |            39,811 (-17,893) |
| React ESM      |          188,576 (-91,335) |            47,216 (-22,169) |
| React UMD      |          131,097 (-60,990) |            39,758 (-17,790) |
| Icons ESM      |          115,725 (-61,128) |            32,396 (-14,289) |
| Icons UMD      |          122,374 (-59,984) |            33,137 (-13,878) |
| Styles CSS     |               271,808 (+0) |                37,164 (+72) |

The OSV result is point-in-time evidence, not a guarantee against future
advisories. The four scoped resolutions and their expected install warnings are
the remaining security-maintenance risk, with the Storybook UUID major override
the highest compatibility concern. Azure's actual protected release job was not
run. No package was versioned or published, and no tag or credential was created
or exposed.

## Template retirement and Storybook 10 migration — 2026-07-16

This section supersedes the current-state Storybook 8, retained-template, and
Storybook UUID-resolution statements above. Earlier sections remain the
historical evidence for their respective stages.

### Baseline and scope

Before the dependency and configuration edits, the working-copy Storybook
8.6.18 build failed in the long-lived install with
`[storybook:react-docgen-plugin] _lruCache is not a constructor`. This is
recorded as a baseline/local-install failure rather than a Storybook 10
regression because the same checkout had the previously documented stale nested
Babel/`lru-cache` drift. There is no successful clean Storybook 8 artifact for a
production-build or bundle-size comparison.

The active Storybook inventory before this stage was 59 story source files, 188
stories, and 59 generated docs entries, for 247 index entries in total. Template
import and package-reachability searches found no active Handlebars consumer and
only one Twig import, which populated an obsolete, unconsumed story parameter.

### Template cleanup

- Removed 27 `.hbs` and five `.twig` files after auditing their imports,
  Storybook configuration, package reachability, and quarantined `othersrc`
  references. The Blockquote implementation and story remain; only its unused
  Twig import and parameter were removed.
- Removed the direct React-workspace `handlebars` development dependency, stale
  Twig story comments, and the React and website Twig module declarations. No
  `.hbs`, `.handlebars`, or `.twig` source remains in the repository.
- `yarn why twig` now reports no match. Handlebars is not claimed to be absent
  from the installed toolchain: `handlebars@4.7.9` remains transitively through
  `ts-jest` and through Lerna's conventional-changelog tooling.
- The retired templates were not covered by the React package's `files`
  allowlist and therefore were not present in its published tarball. No
  JavaScript or TypeScript legacy implementation was removed.

### Storybook dependencies and configuration

- Upgraded the latest stable line observed for this audit by exact-pinning
  `storybook`, `@storybook/react-vite`, and `@storybook/addon-docs` at 10.5.0.
  Vite remains on its reviewed 6.4 line.
- Removed direct `@storybook/react`, `@storybook/addon-actions`, and the unused
  `eslint-plugin-storybook`. Actions, manager APIs, and theming now use
  Storybook 10's consolidated `storybook/actions`, `storybook/manager-api`, and
  `storybook/theming` entry points.
- Removed the cross-major
  `**/@storybook/addon-actions/uuid` resolution. Three scoped OSV resolutions
  now remain; the Storybook override and its compatibility risk no longer apply.
- Made the active CSF glob and docs addon explicit, enabled autodocs through
  preview tags, typed the config and preview against `@storybook/react-vite`,
  and selected TypeScript bundler resolution for this boundary.
- Made theme and text-direction globals deterministic, including initial values,
  body classes, and `dir`, and moved the manager panel setting to Storybook 10's
  `layout.panelPosition` configuration.

### Story behavior and compatibility repairs

- Fixed invalid Avatar component metadata and Item/Text story metadata that
  referenced nonexistent identifiers. Replaced unavailable Hero and Empty story
  images with checked-in assets, and stopped Hero from emitting
  `background-image: url(undefined)` when no image is supplied. A focused Hero
  test protects the absent-image case.
- Restored ContentSwitcher's established object callback payload
  (`{ index, name, text }`) across pointer and keyboard selection and restored
  index zero as the default selected item. Three Testing Library tests cover the
  default state and both interaction paths while the active story still uses the
  quarantined `othersrc/Switch` compatibility component.
- Moved React Hook Form state out of Storybook args/context and into a typed
  decorator-owned React context. PasswordInput and TextInput consume that
  context, while docs use stable static source instead of serializing live form
  objects.
- Made the DatePicker and range-picker stories controlled so date selection is
  visible and repeatable. Public date input types were widened to accept
  `Date | null` and setter callbacks while retaining the previous string forms.
  `ButtonKind` was widened to include the already supported rendered variants.
  Both type changes are additive.
- No root public export name, compatibility alias, CSS class, token, or icon name
  was intentionally changed. Hero rendering with a valid image remains
  unchanged; only the invalid absent-image style is omitted. Story sources are
  not published, although the React package intentionally includes its
  `.storybook` configuration, so packed-package validation remains required.

The final generated index retained exactly 247 entries: 188 stories and 59 docs
entries across the same 59 source files.

### Final validation evidence

| Check | Result recorded 2026-07-16 |
| --- | --- |
| Fresh `yarn install --frozen-lockfile` | Passed; expected React 16-era peer warnings remain |
| `yarn security:scan` | Passed with no findings after the first sandboxed attempt failed to resolve the public OSV service and the network-enabled retry completed |
| `yarn lint` | Passed with 0 errors; 65 React warnings and 22 website warnings remain recorded debt |
| `yarn typecheck` | Passed for the shipped React surface and website after deterministic token/demo generation |
| `yarn test` | Passed: 14 suites, 95 tests, and 4 snapshots; quarantined JavaScript suites remain excluded |
| `yarn build:packages` | Passed, including default tokens, Sass/CSS, icon tooling, 81 generated icons, declarations, and the Vite React build |
| `yarn build:storybook` | Passed on Storybook 10.5.0 with 802 transformed modules; Sass `if()` deprecations and large-chunk warnings remain non-fatal |
| Storybook doctor | `npx --yes storybook@10.5.0 doctor` exited 0 without diagnostics |
| Focused Hero suite | Passed: 1 suite and 6 tests |
| Story browser crawl | Passed 188/188 without a Storybook error boundary, uncaught page error, console error, or local HTTP failure |
| Docs browser crawl | Passed 59/59 under the same checks |
| Interaction smoke | Passed 12/12 final scenarios across bounded browser runs; the separate React Hook Form TextInput scenario also passed |
| `yarn build:website` | Passed and generated all 154 static pages; existing offline Figma-fetch, metadata, and demo-source warnings remain |
| `yarn verify:packages` | Passed: 127 React exports, 81 icon exports, and 282 declaration files |
| `yarn verify:packed-packages` | Passed for isolated ESM, CommonJS, UMD, compiled Sass, and strict TypeScript consumers |
| `yarn verify:public-exports` | Passed; the React root surface remains exactly 127 baseline names |
| `yarn verify:bundle-size` | Passed every configured raw and gzip threshold |
| `yarn verify:clean` | Passed after the full generation and build sequence in a detached clean worktree |

The successful interaction coverage included Button, Checkbox,
ContentSwitcher, Modal keyboard close, controlled date range selection, React
Table sorting, Pagination, Tooltip, Loading, MainNavigation, React Hook Form
PasswordInput, and dark/RTL globals. The additional React Hook Form TextInput
check verified the same decorator path.

The packed React artifact contained 312 files / 2,872,059 bytes. Bundle output
was 131,795 bytes CommonJS (39,813 gzip), 188,585 bytes ESM (47,220 gzip), and
131,102 bytes UMD (39,762 gzip). Public-export and bundle comparisons therefore
remain within the recorded compatibility baselines.

After the changes were split into Conventional Commits, commit `3893c0158` was
checked out into a detached worktree with no `node_modules`. The clean
`yarn install --frozen-lockfile` completed in 25.82 seconds and left the checkout
clean. With the verified OSV-Scanner 2.3.8 binary, the complete `yarn validate`
release gate then exited 0 in 190.01 seconds, including its final
`verify:clean`. Public network access was used only for OSV queries and the
isolated packed-package consumer; no credentialed service or publishing command
was used.

### Non-passing attempts and remaining debt

- The first complete story crawl exposed 19 affected entries: undefined
  Avatar/Item/Text references and unavailable or invalid Empty/Hero assets. The
  source fixes above were made before the successful 188/188 story and 59/59
  docs reruns.
- The initial broad interaction run passed 5 of 12 scenarios. Its seven failures
  combined real ContentSwitcher callback/default-selection and uncontrolled Date
  story defects with overly broad automation assumptions for Checkbox, Modal,
  React Table, Pagination, and Tooltip. The defects and browser targeting were
  separated, and the bounded final runs passed all 12 scenarios.
- The Storybook-source-only command
  `yarn tsc --noEmit --project packages/react/tsconfig.storybook.json --pretty false`
  exited 2 with 64 diagnostics under the repository's TypeScript 5.9 compiler.
  Diagnostics remain in MDX dependency declarations, legacy CSF stories that
  rely on an undeclared `Story` type, React Hook Form story values, and existing
  story prop values. Explicit `.tsx` demo imports are now accepted only inside
  this no-emit bundler boundary. This is tracked Storybook migration debt, not a
  hidden pass and not a regression in the successful root type-check, which
  intentionally checks the shipped React surface and website.
- Yarn Classic initially linked the root `tsc` executable to Lerna's nested
  TypeScript 5.3 even though all owned workspaces declare 5.9.3. A direct root
  TypeScript 5.9.3 development dependency now makes the release/tooling compiler
  deterministic. `yarn tsc --version` now reports 5.9.3 and the complete root
  `yarn typecheck` passed with that compiler after the lockfile refresh.
- The first post-change frozen install was attempted inside the network-restricted
  sandbox and stopped on `ENOTFOUND registry.yarnpkg.com`. The network-enabled
  lock refresh then passed, and a subsequent `yarn install --frozen-lockfile`
  exited 0 without changing the lockfile.
- Legacy CSF2 `.story` metadata and `componentSubtitle` parameters remain; the
  latter produces a Storybook deprecation warning. Migrating those stories to
  typed CSF3 should be a separate ownership-based change.
- Storybook 10 is ESM-only and compatible with the repository's Node 24 policy,
  but Storybook does not support the retained Yarn Classic workflow. A Yarn 4
  migration needs its own workspace, install, CI, and publishing compatibility
  review.
- The browser crawls are recorded validation evidence, not a committed permanent
  regression gate. Stable `play` functions, accessibility checks, and visual
  regression coverage remain recommended follow-up work.
- Hero is not currently exported from `src/indexStories.ts`; its checked-in Vite
  asset is therefore valid for Storybook but is not yet a website-demo asset.
  If Hero is added to that demo index, first add a deterministic shared/public
  asset copy so the source-extraction bundle does not emit a missing URL.
- Removing transitive Handlebars requires focused replacements or upgrades for
  `ts-jest` and Lerna's changelog tooling; it should not be forced through a
  global resolution.

No package was versioned or published, no tag was created, and no registry,
Azure, Algolia, or other credentialed remote write was performed in this stage.
