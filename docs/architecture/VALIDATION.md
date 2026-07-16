# Validation, task routing, and release safety

Run repository commands from the root. Capture the command, exit status, and
relevant counts; warnings or partial output are not a pass. If a command already
fails on the untouched branch, record that baseline separately before changing
code. See the [repository architecture](README.md) for package and generated-file
ownership.

## Toolchain policy

| Tool | Repository policy/current line | Source of truth |
| --- | --- | --- |
| Node.js | 24 LTS; `>=24 <25` | `.nvmrc`, root/website `engines`, Azure pipeline |
| Yarn | 1.22.22 | Root `packageManager` and `engines`, Azure activation step |
| OSV-Scanner | 2.3.8, blocking zero-finding policy | `scripts/osv-scan.mjs`, root validation, Azure pipeline |
| Lerna | 9.0.7 line; independent package versions | Root `package.json`, `lerna.json`, lockfile |
| React / React DOM | 19.2.7 development runtime; public peer range starts at 19.1.1 | React workspace manifest and lockfile |
| TypeScript | 5.9.3 line | React, website, and icons-core manifests; lockfile |
| Vite / Rollup | Vite 6.4.3 line; Rollup 4.62.2 | React and icons-core manifests; lockfile |
| Jest / Storybook | Jest 30.4 line; Storybook 8.6.18 line | React manifest; lockfile |
| ESLint / Next.js | ESLint 9.39.5 line; Next 16.2.10; `next-mdx-remote` 6.x | React/website manifests; lockfile |
| Sass / Style Dictionary | Sass 1.98 line; Style Dictionary 3.9.2 | Styles/themes manifests; lockfile |

Do not infer versions from globally installed tools. When changing a toolchain
line, update manifests, `yarn.lock`, Node policy files, CI, this table, and the
relevant build/consumer fixtures together. Avoid broad `--latest` upgrades.

## Validation tiers

### 1. Preflight

```sh
git status --short --branch
node --version
yarn --version
yarn install --frozen-lockfile
yarn security:scan
```

Confirm a task branch, preserve existing edits, and record the install baseline.
A frozen install must not change `yarn.lock`.
The security scan uses the digest-pinned OSV-Scanner Docker image or an explicit
`OSV_SCANNER_BIN` that reports version 2.3.8. It queries the public OSV service
for this lockfile scan and must return zero findings. Use
`yarn security:scan -- --json` when machine-readable output is needed; the
wrapper rejects other forwarded scanner flags so the release gate cannot be
bypassed.

### 2. Focused feedback

Run the narrowest owning command while iterating, then run the root command that
creates its prerequisites. Examples:

- React behavior: focused React Jest test, then root `yarn test` and
  `yarn typecheck`.
- Sass/tokens: `yarn generate:tokens`, styles build, and the relevant docs build.
- Icons: `yarn generate:test-assets` before React tests or consumers.
- Website: website lint/type-check while iterating, then root
  `yarn build:website`.

Workspace-only checks may pass because ignored output already exists. Root checks
are the clean-checkout contract.

### 3. Published-package contract

After changing public source, tokens, Sass, icons, manifests, exports, declarations,
or bundler configuration, run:

```sh
yarn build:packages
yarn verify:packages
yarn verify:packed-packages
yarn verify:public-exports
yarn verify:bundle-size
```

The packed-package check creates five tarballs in a temporary directory, strips
npm credential variables/config from child processes, installs from the public
registry, and checks ESM, CommonJS, UMD, Sass, and strict declaration consumers.
It can require network access but must never use private registry credentials.

### 4. Documentation consumers

Run both production consumers for component, style, token, icon, story, MDX, or
website integration changes:

```sh
yarn build:storybook
yarn build:website
```

The website deliberately uses Next's Webpack mode. Do not remove `--webpack`
without a dedicated Turbopack compatibility change.

### 5. Release-equivalent gate

`yarn validate:quick` runs lint, type-checking, and tests for broad local
feedback. `yarn validate:release` is the authoritative release-equivalent
sequence, and `yarn validate` is its stable alias. The release sequence's final
clean check rejects all tracked and untracked files. Use a clean branch or
disposable worktree for a true release-equivalent run; do not delete or overwrite
user work and do not publish, version, or tag to test the pipeline.

## Command-to-output and risk map

“Writes” describes repository or temporary output, not cache activity.

| Root command | Writes/reads | Prerequisite or follow-up | Change risk |
| --- | --- | --- | --- |
| `yarn install --frozen-lockfile` | Populates workspace `node_modules`; reads `yarn.lock` | Lockfile must remain unchanged | Medium: dependency resolution and lifecycle scripts |
| `yarn security:scan` | Reads `yarn.lock`; queries the public OSV service | Docker, or `OSV_SCANNER_BIN` pointing to 2.3.8 | Blocking dependency-inventory gate; no repository writes |
| `yarn lint` | No owned output | React and website source/config | Low; warnings are debt, errors fail |
| `yarn typecheck` | Regenerates default tokens and website demo bundle, then checks React public source and website | Inspect generated cleanliness | Medium: generation can hide stale-input failures |
| `yarn test` | Builds icon tools/icons, then runs active React 19 Jest suites serially | Inspect icon declaration changes | Medium: legacy JS suites remain excluded |
| `yarn generate:tokens` | Recreates `themes-core/dist` from checked-in default tokens | Build styles and token consumers | High: token names/values are public |
| `yarn generate:icons` | Recreates icons-react intermediate, ESM, UMD, and declarations | Requires built icons-core; run package checks | High: icon names/markup are public |
| `yarn build:packages` | Generates tokens, CSS, icon tools/icons, and React distributions | Run all package contract checks | High: all five published packages |
| `yarn build:storybook` | Replaces `packages/react/docs` | Package assets should already exist for release ordering | Medium: visual/docs consumer |
| `yarn build:website` | Regenerates demo/metadata inputs and `.next` | Linked package/token artifacts must exist | Medium: production docs consumer |
| `yarn verify:packages` | Reads built workspace ESM/CJS/UMD/declarations | Run after `build:packages` | High-value, no repo writes |
| `yarn verify:packed-packages` | Packs/installs five packages under a temporary directory | Run after `build:packages`; public network may be needed | Highest package-consumer confidence |
| `yarn verify:public-exports` | Compares built React exports with frozen fixture | Run after React build | Detects root-name additions/removals, not signature changes |
| `yarn verify:bundle-size` | Reads built React/icon/CSS artifacts and fixture thresholds | Update baselines only with reviewed evidence | Detects raw/gzip regressions |
| `yarn verify:clean` | Reads complete Git status | Requires clean tree before command | Fails on intentional uncommitted work as designed |
| `yarn validate:quick` | Runs lint, type-checking, and tests with their owned prerequisites | Working tree may contain intentional edits | Fast broad feedback; not release evidence |
| `yarn validate:release` / `yarn validate` | Starts with the blocking OSV scan, then runs every generator, build, check, and clean-tree assertion | Clean install/worktree and public network for release evidence | Release-equivalent; no publish side effect itself |

## Common task routing

| Task | Start in | Minimum focused evidence | Required broader evidence before merge |
| --- | --- | --- | --- |
| Component behavior, props, or markup | `packages/react/src/components/<Name>`; nearby active test/story/README | Testing Library test and React type-check | Root test/type-check, package build/checks, Storybook; website when documented there |
| React root export or declaration | `packages/react/src/index.ts`, manifest, `vite.config.js`, TS configs | React build/type-check and declaration fixture | All package contract checks and both docs builds |
| CSS/Sass or class changes | `packages/styles/index*.scss`, `scss/**`; matching component | Styles build and affected Storybook stories | Package/packed checks, Storybook, website, bundle comparison; document intentional selector changes |
| Token change | `packages/themes-core/tokens/**`, `scripts/config.js` | Local token generation and diff of names/values | Styles, Storybook, website, packed Sass, bundle and clean checks |
| Icon artwork/name | `packages/icons/src/svg`; generator only if systematic | Icon generation and visual/source review | React test, package/packed/export checks, Storybook/website consumers |
| Icon generator/API | `packages/icons-core/src`, Rollup/TS config | Icons-core build and icons-react generation | All package contract checks and declaration consumer |
| Website code/content | `packages/website/{app,pages,components,_posts,scss}` | Website lint and type-check | Website production build; Storybook/package checks only if shared API changed |
| Search index content | Website `_posts`; `runAlgoliaUpdate.mjs` | `search:index:check` dry run | Trusted deployment review; never run update locally without authorization |
| Enzyme/legacy migration | Existing TS implementation/test plus `packages/react/LEGACY.md` | One behavior-equivalent Testing Library migration | Root test/type-check and relevant package/docs checks; remove dependencies only at zero references |
| Dependency/toolchain | Owning manifests, `yarn.lock`, CI/config | Frozen clean install, `yarn security:scan`, and affected workspace checks | Full `yarn validate` from a clean checkout, with baseline/regression comparison |
| CI/release configuration | `azure-pipelines.yml`, root scripts, `lerna.json` | Syntax/static review without secrets | Non-production pipeline rehearsal; no registry publication |

## Secret and publishing guardrails

- Root `publish:*`, `lerna:publish*`, and `lerna:version*` commands have external
  side effects even though they begin with validation. Only an authorized release
  owner or protected pipeline may run them.
- CI must validate before versioning and before the secure `.npmrc` is
  materialized. The file must be removed after the publish attempt and must never
  be printed or archived.
- Do not echo secret variables, use shell tracing around credentials, embed
  credentials in Git URLs, or copy `.npmrc` into workspaces/artifacts.
- `yarn workspace @progressiveui/themes-core build:tokens` downloads from private
  Azure into `figmaTokenStudio/tokens.json`, filters to a token input, and builds.
  Routine validation must use checked-in inputs via `yarn generate:tokens`.
- `yarn workspace @progressiveui/core-website search:index:update` replaces the
  remote Algolia index. It requires `ALGOLIA_INDEX_WRITE=update-ui-docs`, the
  application ID, and an admin key. Keep the admin key server-only; use
  `search:index:check` for local validation.
- Package-verification scripts must continue to reject `.npmrc`, `.env`, tests,
  stories, and other non-production files from tarballs.
- `yarn security:scan` is a blocking zero-finding gate and runs first in the
  release-equivalent sequence. Do not add `continueOnError`, an ignore list, or a
  baseline exception without a time-bounded security review recorded in
  `MODERNIZATION.md`.
- Validation does not authorize versioning, tagging, pushing, mirroring,
  publishing, remote token synchronization, or remote search indexing.
