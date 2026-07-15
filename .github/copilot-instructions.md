# Progressive UI agent instructions

Read `/AGENTS.md` before making changes. The canonical pre-release command is `yarn validate`; versioning and publishing are never diagnostic commands.

Key constraints:

- Preserve the 127-name runtime surface from `packages/react/src/index.ts` unless a documented deprecation is approved.
- Preserve rendered behavior, CSS classes, Sass entry points, and token names.
- React uses native ESM/CJS outputs with compatibility aliases. Run all package verification scripts after build changes.
- TypeScript defaults to `allowJs: false`. JavaScript is confined to declaration, Storybook, and legacy configs.
- Active tests are dot-named TypeScript Testing Library tests. `*-test.js` is the isolated Enzyme suite; migrate before removing.
- Do not delete anything in `packages/react/othersrc` or matching `.legacy`/`old` without satisfying `packages/react/LEGACY.md`.
- Local token validation is `yarn generate:tokens`; do not run authenticated token sync without explicit need and authorization.
- Do not hand-edit generated React bundles, icon outputs, token outputs, website metadata, or Storybook output.
- CI must validate before version/tag/publish and must never display `.npmrc` or secret environment values.

Use Node 22.12+ and Yarn 1.22.22. Keep changes small and use Conventional Commit messages.
