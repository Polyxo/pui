# React legacy-code inventory

Legacy code is intentionally quarantined while compatibility requirements are established. No legacy component was deleted during the 2026 modernization.

## Current inventory

- `othersrc`: 76 files in 14 component directories.
- `src` old/legacy variants: 35 files matching `.legacy` or `old` naming.
- JavaScript `*-test.js` suites: 66; 64 still import Enzyme. The two exceptions are pre-existing Testing Library suites under `othersrc`.
- Active cross-boundary reference: the `ContentSwitcher` Storybook story imports `othersrc/Switch`.
- Redux Form is referenced by internal wrappers, historical documentation, and legacy examples.
- React Table v7 is used by the table story and a legacy table story, not the shipped runtime bundle.

## Isolation boundaries

- The production declaration and package builds exclude `othersrc`, stories, tests, old files, and `.legacy` files.
- `tsconfig.legacy.json` is the explicit JavaScript/legacy compiler boundary.
- The active Jest project discovers dot-named TypeScript tests only. It never loads the React 16 Enzyme adapter.
- Enzyme remains installed until every required suite has a Testing Library replacement.

## Removal gate

Before removing any legacy file or dependency:

1. Search source, stories, docs, generated metadata, and downstream repositories for imports.
2. Identify the supported replacement and compare behavior, markup, CSS classes, tokens, and accessibility.
3. Migrate tests to Testing Library and add a public-export/package-consumer check where relevant.
4. Publish a deprecation notice for any reachable path and keep an agreed compatibility window.
5. Remove the code in a dedicated pull request with bundle and export comparisons.

## Suggested migration order

1. Convert the remaining hybrid Testing Library/Enzyme suites.
2. Convert pure Enzyme suites by active public component.
3. Move the `ContentSwitcher` story off `othersrc/Switch`.
4. Audit Redux Form wrappers and replace examples with React Hook Form or Final Form.
5. Replace the React Table v7 story with the supported table integration.
6. Remove unreachable old variants only after downstream-search evidence is attached.
