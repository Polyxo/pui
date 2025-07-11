# Progressive UI

Design once. Deliver everywhere.

A modern design system for building progressive applications that scale seamlessly across all devices.

Based on a fork of the World Food Programme UI Kit (WFP-UI) 🇺🇳

## ![Usage](https://cdn.wfp.org/guides/ui/v1.2.0/assets/internal/toolkit.svg "Usage") Usage

### Development 🚧

#### WARNING: This branch is experimental and in current development. Things could easily break!

### Contribution Guidelines

Please refer to the [Contribution Guidelines](./.github/CONTRIBUTING.md) before starting any work.

### Installing the monorepo

Requirements: `node.js 14.x`, `yarn 1.x`
Use the `feat/` branches for active development.

Clone the `develop` branch for the un-core monorepo. TODO: Update Branch naming

The project is using a `lerna/yarn` mono repository for development. Make sure you have [yarn](https://yarnpkg.com/) installed globally on your machine.

```bash
git clone --branch develop https://github.com/wfp/designsystem.git
yarn install
yarn build
```

### Packages

All packages can be found inside `packages/`.

- `layout`: breakpoints, spacings, etc. no longer used, now themes!
- `icons` all icons
- `icons-core` tools to generate `icons`, `pictograms` and `humanitarian-icons`
- `icons-react` the react package of the icons
- `styles`: all components styles
- `themes`: theming (colors, etc.) TODO: move to themes-core
- `react`: the react components

### Documentation & list of components available

View available Components [here](https://example.org. Usage information is available when you click the blue **Show Info** icon in the top right corner of the selected component.

### Using the server

We recommend the use of [React Storybook](https://github.com/storybooks/react-storybook) for developing components.

1. Generate new tests

```
npm run test
```

2. Start the server:

```
npm run storybook
```

3. Open browser to `http://localhost:9000/`.
4. Develop components in the `/components` folder. Add the export to `index.js` to include them into the build.
5. Write stories for your components in `/.components` with `.stories.js` or `stories.mdx` ending.

### Commits

Use [Conventional Commits](https://www.conventionalcommits.org) for commit messages and pre-commit hooks for commiting.

Make sure your commit does not produce any errors while checking:

- ESlint
- jest tests
- correct commit message

### Testing

Use jest for testing the components. Once commited the branches will be also tested on [Travis CI](https://travis-ci.org/wfp/ui).

```
npm run test
```

### Deployment

The UN Core uses Azure Devops, yarn, lerna and [semver](https://github.com/lerna/lerna/tree/main/commands/version) for automated versioning and the deployment.

#### npm release

- Commits on the `master` branch will be released as `@lastest` if a relevant commit is included (e.g. feat, fix, perf, breaking)
- Commits on `next` branch will be released as `@next` if a relevant commit is included

### Generate and release an alpha from a local machine

```
yarn publish:alpha-cli

or
git push --follow-tags origin next && npm publish --tag alpha
```

To publish local changes directly to a alpha release on npm.

### Credits

[View Credits](https://www.designsystem.wfp.org/support/credits)
