# Repository architecture

This document tells maintainers and coding agents where behavior originates and
which generated or published artifacts a change can affect. Keep it structural;
record dated migrations and command results in `MODERNIZATION.md` or a pull
request instead. See [VALIDATION.md](VALIDATION.md) for commands, task routing,
and release safety.

## Package graph

```text
packages/themes-core/tokens
  -> @progressiveui/themes-core
       -> @progressiveui/styles
            -> @progressiveui/react (development/docs styling)
       -> @progressiveui/react (development/docs tokens)
       -> website

packages/icons/src/svg + @progressiveui/icons-core
  -> @progressiveui/icons-react
       -> @progressiveui/react (runtime)
       -> website

@progressiveui/react + @progressiveui/styles + @progressiveui/themes-core
  + @progressiveui/icons-react
  -> website
```

| Path | Package | Visibility | Role and local edges |
| --- | --- | --- | --- |
| `packages/themes-core` | `@progressiveui/themes-core` | Published | Owns token inputs and the theme builder; consumed by styles, React development builds, and website. |
| `packages/styles` | `@progressiveui/styles` | Published | Owns Sass/CSS; consumes themes-core and registry packages `@un/layout` and `@un/themes`. |
| `packages/icons` | `@progressiveui/icons` | Private | Owns source SVGs; build input to icons-react. |
| `packages/icons-core` | `@progressiveui/icons-core` | Published | Owns SVG-to-React conversion and bundling code; build tool for icons-react. |
| `packages/icons-react` | `@progressiveui/icons-react` | Published | Generated React icon package; consumes private icon SVGs and icons-core while building. |
| `packages/react` | `@progressiveui/react` | Published | Owns components; runtime-depends on icons-react and uses styles/themes for development and docs. |
| `packages/website` | `@progressiveui/core-website` | Private | Next.js documentation consumer of all user-facing packages. |

The root is private and orchestrates all seven workspaces with Yarn 1 and Lerna.
Lerna uses independent versions. `packages/layout` is not a workspace: it has no
manifest and the active styles dependency resolves `@un/layout` from the
registry.

Current contract inventory, verified from manifests and fixtures:

- 7 workspaces: 5 published and 2 private.
- 127 frozen `@progressiveui/react` root runtime export names.
- 81 generated `@progressiveui/icons-react` exports.
- 5 packages exercised as packed external consumers.

Treat these as assertions, not targets to edit around. If an intentional API
change updates a count, update its fixture, consumer checks, and this inventory in
the same reviewed change.

## Public sources of truth

| Contract | Authoritative source | Generated/published form | Compatibility check |
| --- | --- | --- | --- |
| React root runtime names | `packages/react/src/index.ts` | `packages/react/dist/index.mjs`, `index.cjs`, `index.umd.js` | `scripts/fixtures/react-public-exports.json`; `yarn verify:public-exports` |
| React public types | Production TypeScript reachable from `src/index.ts`; `tsconfig.declarations.json` | `packages/react/dist/**/*.d.ts` | Root type-check, declaration consumer, packed-package verification |
| React resolution and legacy aliases | `packages/react/package.json`; `vite.config.js` | Conditional root export plus `dist/index.es.js` and `dist/index.cjs.js` aliases | `yarn verify:packages`; `yarn verify:packed-packages` |
| Component behavior/markup | `packages/react/src/components/**` | ESM, CJS, and UMD runtime | Active Testing Library tests; Storybook and website builds; legacy tests are evidence until migrated |
| CSS selectors and Sass API | `packages/styles/index*.scss`; `packages/styles/scss/**` | `styles.css` and exported Sass subpaths | Styles build, Storybook/website builds, packed Sass consumer; preserve selector names |
| Default tokens | `packages/themes-core/tokens/**/*.json`; `scripts/config.js` | `dist/json` and `dist/scss` | `yarn generate:tokens`, styles consumers, packed Sass consumer, clean-tree review |
| Dark tokens | Checked-in `packages/themes-core/distDark/**` | Published dark Sass/JSON subpaths | Treat as a frozen legacy artifact until source-to-output fixtures exist |
| Icon names and artwork | `packages/icons/src/svg/**/*.svg` | `packages/icons-react/{es,umd}` and declaration barrels | `yarn generate:test-assets`; package and packed-package verification |
| Icon tool API | `packages/icons-core/src/index.ts` and reachable source | `build/bundle.js`; `dist/bundle.d.ts` | Package ESM/CJS and strict declaration smoke tests |
| Website content | `packages/website/_posts`, `app`, `pages`, `components`, and `scss` | `.next` production output | Website lint, type-check, production build, and safe search-index dry run when relevant |

The frozen React export fixture currently protects root export names, not full
type signatures or semantics. A wildcard package export preserves historic deep
imports but does not make new deep imports preferred API. Before deleting or
moving a published file, search downstream usage and provide a compatibility or
deprecation path.

## Generation DAG

Arrows mean “must exist before” rather than package-manager dependency alone.

```text
themes-core/tokens/**/*.json
  -- generate:tokens --> themes-core/dist/{json,scss}
  + themes-core/distDark (tracked/frozen)
  + styles/{index*.scss,scss/**}
  -- styles build --> styles/styles.css

icons-core/src/**
  -- icons-core build --> icons-core/build/compiled/**
                       -> icons-core/build/bundle.js{,.map}
                       -> icons-core/dist/bundle.d.ts

icons/src/svg/**/*.svg
  + built icons-core
  -- generate:icons --> icons-react/dist/** (intermediate components)
                    -> icons-react/es/index.{js,mjs,d.ts}
                    -> icons-react/umd/index.js
                    -> icons-react/index.d.ts

react/src/index.ts + reachable production source + built icons-react
  -- React Vite build --> react/dist/{index.mjs,index.cjs,index.umd.js}
                      -> compatibility aliases and source maps
                      -> react/dist/**/*.d.ts

react/src/indexStories.ts + component stories
  -- React build:demos --> website/demoCode/dist/bundle.js

react/src/components/**/*.tsx
  -- generate:website-metadata --> website/types/src/components/**/*.json

React stories/config + styles/themes/icons
  -- build:storybook --> react/docs

website source + demo bundle + metadata + linked package artifacts
  -- build:website --> website/.next
```

The root orchestration is intentionally ordered:

```text
build:packages = tokens -> styles -> icon tools -> React icons -> React
typecheck      = tokens -> demo bundle -> React types -> website types
test           = icon tools -> React icons -> React Jest
build:website  = demo bundle -> prop metadata -> Next production build
validate       = lint -> typecheck -> test -> package build -> Storybook
                 -> website -> package/pack/export/size checks -> clean tree
```

## Generated ownership

| Output | Owner | Tracked? | Editing rule |
| --- | --- | --- | --- |
| `packages/themes-core/dist/**` | `yarn generate:tokens` | No | Change token input or generator. |
| `packages/themes-core/distDark/**` | Legacy dark-token pipeline | Yes | Frozen; do not regenerate without golden compatibility fixtures. |
| `packages/styles/styles.css` | Styles workspace build | No | Change Sass source. |
| `packages/icons-core/build/**`, `dist/**` | Icons-core build | No | Change TypeScript/Rollup source. |
| `packages/icons-react/dist/**`, `es/**`, `umd/**`, `index.d.ts` | Icons-react build | Outputs ignored; root declaration is tracked | Change SVG source or generator, then inspect the tracked declaration diff. |
| `packages/react/dist/**` | Vite and declaration plugin | No | Change production source/build config. |
| `packages/website/demoCode/dist/**`, `types/**` | Website asset generation | No | Change stories/components or generator. |
| `packages/react/docs/**`, `packages/website/.next/**` | Production docs builds | No | Change source/config; never patch build output. |

## Legacy and quarantine boundaries

The production package and declaration builds exclude `packages/react/othersrc`,
stories, tests, `*.legacy.*`, and `*-old*` files. `tsconfig.legacy.json` owns the
relaxed JavaScript boundary. The React 19 Jest project discovers dot-named
TypeScript tests and does not initialize the React 16 Enzyme adapter.

Before deleting quarantined material:

1. Search runtime source, stories, website content, generated metadata, git
   history, and known downstream repositories.
2. Identify the replacement and compare behavior, markup, selectors, tokens,
   exports, types, and accessibility.
3. Move required behavior to Testing Library and add package-consumer coverage
   where the path was reachable.
4. Document deprecation and compatibility timing for any downstream path.
5. Remove it in a dedicated pull request with export, package, and bundle evidence.

See `packages/react/LEGACY.md` for the dated inventory and migration order. Also
treat `*.new` files and the non-workspace `packages/layout` directory as
unclassified historical evidence until a reference audit assigns or removes them.
