# Repository guide for coding agents

Progressive UI is a production React design-system monorepo. Use the repository's
Node 24 LTS policy (`.nvmrc`, root `engines`, and CI) and Yarn 1.22.22. The
compatibility contract includes public exports and types, component behavior and
markup, CSS classes, generated CSS, token names and values, and documented deep
package paths.

## Read before editing

- Read [`docs/architecture/README.md`](docs/architecture/README.md) for the
  package graph, public sources of truth, and generation DAG.
- Read [`docs/architecture/VALIDATION.md`](docs/architecture/VALIDATION.md) for
  task routing, command outputs, validation tiers, and release guardrails.
- Read [`packages/react/LEGACY.md`](packages/react/LEGACY.md) before touching
  `othersrc`, Enzyme tests, `.legacy` files, or `*-old*` files.
- Treat [`MODERNIZATION.md`](MODERNIZATION.md) as a historical audit and decision
  record, not as current command documentation.
- Check `git status --short --branch` first. Preserve unrelated changes and work
  on a task branch, never directly on the default branch.

## Workspace boundaries

There are seven Yarn workspaces: five publishable packages and two private
workspaces.

- `packages/react`: public React components; `src/index.ts` is the root runtime
  export surface.
- `packages/styles`: public Sass sources and generated `styles.css`.
- `packages/themes-core`: public tokens and the Style Dictionary-compatible
  theme builder.
- `packages/icons`: private SVG source workspace.
- `packages/icons-core`: public icon-generation library.
- `packages/icons-react`: generated public React icons.
- `packages/website`: private Next.js documentation site.

`packages/layout` has no `package.json` and is not a workspace. It is tracked
historical output; the active Sass dependency is the registry package
`@un/layout`. Do not edit or delete the local directory without a separate
reference and compatibility audit.

## Canonical commands

Run commands from the repository root. Root commands generate the prerequisites
they consume; prefer them to workspace commands from a stale checkout.

```sh
yarn install --frozen-lockfile
yarn security:scan
yarn lint
yarn typecheck
yarn test
yarn build:packages
yarn build:storybook
yarn build:website
yarn verify:packages
yarn verify:packed-packages
yarn verify:public-exports
yarn verify:bundle-size
yarn verify:clean
```

`yarn validate` runs that full sequence before versioning or publishing.
`verify:clean` expects an entirely clean working tree, including no untracked
files, so run the release-equivalent gate from a clean branch or disposable
worktree. Never commit user changes merely to make this check pass.

`yarn security:scan` runs OSV-Scanner 2.3.8 against `yarn.lock` and fails on any
known affected version. It uses the digest-pinned Docker image by default. When
Docker is unavailable, set `OSV_SCANNER_BIN` to a local 2.3.8 binary; the wrapper
rejects other versions. The scan queries the public OSV service and never needs
registry credentials. Use `yarn security:scan -- --json` for machine-readable
stdout; other forwarded scanner flags are rejected so the gate cannot be
bypassed.

## Generated boundaries

- Default token source: `packages/themes-core/tokens`; local output:
  `packages/themes-core/dist`.
- `packages/themes-core/distDark` is a tracked legacy artifact. Do not regenerate
  it until dark-token name/value fixtures exist.
- Icon source: `packages/icons/src/svg`; generated outputs:
  `packages/icons-react/dist`, `es`, `umd`, and declarations.
- Icon-tool output: `packages/icons-core/build` and `dist`.
- React package output: `packages/react/dist`.
- Website demo and prop metadata: `packages/website/demoCode/dist` and
  `packages/website/types`, owned by `yarn generate:website-assets`.
- Storybook output: `packages/react/docs`; website output:
  `packages/website/.next`.

Do not hand-edit generated output. Change the source or generator, run the owning
root command, and inspect `git status --short` for unexpected changes. Generated
directories are mostly ignored; a successful build alone does not prove a clean
or compatible result.

## Compatibility and legacy rules

- After changing `packages/react/src/index.ts`, package manifests, or build
  configuration, run the package build and all four `verify:*` contract checks
  described in the validation guide.
- Preserve ESM, CommonJS, UMD, declarations, Sass/CSS, and documented compatibility
  aliases. Wildcard exports preserve historical deep paths; do not narrow them
  accidentally.
- Do not rename CSS selectors, custom properties, token names, or icon exports as
  part of tooling work.
- `packages/react/othersrc`, `*.legacy.*`, `*-old*`, and `*.new` files are
  quarantined evidence, not deletion candidates.
- JavaScript `*-test.js` suites are excluded from the React 19 Jest project. Most
  still require Enzyme and the React 16 adapter. Replace required behavior with
  Testing Library coverage before removing any suite or either dependency.
- Redux Form, React Dates, and React Table v7 remain compatibility/example
  dependencies. Remove them only through an explicit, tested migration.
- `allowJs` and relaxed TypeScript settings are deliberate boundary exceptions,
  not patterns for new code. New production code and tests should be TypeScript.

## Security and remote side effects

- Never print or read back `.npmrc`, secret environment values, registry tokens,
  Azure secure files, or generated credential helpers.
- Never run a root `publish:*`, `lerna:publish*`, or `lerna:version*` script for
  diagnosis. These can version, tag, push, or publish packages.
- Routine token generation is `yarn generate:tokens`. The themes-core
  `build:tokens` command contacts private Azure, requires `GIT_ACCESS_TOKEN`, and
  rewrites token inputs; run it only with explicit authorization.
- Algolia indexing is a separate administrative write operation. The safe local
  check is `yarn workspace @progressiveui/core-website search:index:check`.
  `search:index:update` requires an admin key and explicit confirmation and may
  run only in an authorized trusted deployment job.
- Keep validation before every version, tag, publish, or mirror step. Do not add a
  CI command that echoes config files or credentials.
- Do not make `security:scan` advisory-only, add `continueOnError`, or suppress a
  finding without a documented owner, reachability assessment, and review date.

## Dependency and lockfile changes

- Start with `yarn why <package>` and the OSV advisory's fixed-version events.
  Identify the direct owner and whether it is shipped runtime, build, test,
  documentation, or release tooling before choosing an upgrade.
- Yarn Classic's `upgrade --pattern` only selects direct workspace requests; it
  does not reliably refresh a vulnerable transitive entry under an otherwise
  current parent. Refresh the smallest compatible parent subtree and inspect the
  resulting `yarn.lock` diff.
- Prefer a parent upgrade or a patched version inside the declared range. Use a
  root `resolutions` entry only for an exact transitive pin with no patched parent,
  scope it to the owning path, and record why the cross-range override is safe.
  Never flatten multi-major packages such as `minimatch` or `picomatch` globally.
- After any dependency edit, run a frozen install and `yarn security:scan` from a
  fresh checkout, followed by the owning checks and full `yarn validate`.

## Change discipline

- Keep changes scoped and use small Conventional Commits.
- Record baseline failures separately from regressions; never claim an unrun
  command passed.
- Update tests, Storybook/docs, declarations, and compatibility fixtures with the
  implementation they describe.
- Prefer deterministic scripts, explicit file ownership, and stable command
  output. Document any new generator or public entry point in the architecture
  map.
- End generation work by reviewing `git diff --stat`, `git diff`, and
  `git status --short`; generated code must not conceal source changes.
