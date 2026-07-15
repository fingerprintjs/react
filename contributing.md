# Contributing to Fingerprint React SDK

## Working with code

We use [pnpm](https://pnpm.io/) for installing dependencies and running scripts.

The main branch is locked for the push action. For proposing changes, use the standard [pull request approach](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request). It's recommended to discuss fixes or new functionality in the Issues first.

### How to build

Just run:

```shell
pnpm install
pnpm build
```

### Development playground

Six demo apps are available:

1. [`create-react-app`](examples/create-react-app/README.md) — a rich demo covering different caching strategies.
2. [`next`](examples/next/README.md) — a Next.js demo for testing SSR scenarios.
3. [`next-appDir`](examples/next-appDir/README.md) — the same Next.js demo using the `app` directory.
4. [`preact`](examples/preact/README.md) — a Preact demo.
5. [`vite`](examples/vite/README.md) — a Vite demo.
6. [`webpack-based`](examples/webpack-based/README.md) — a demo using raw webpack.

Build the SDK before building or starting an example app. From the repository root, run:

```shell
pnpm build
```

Build an example with `pnpm --filter <package-name> build`, or start it with
`pnpm --filter <package-name> dev`.

For example:
```shell
pnpm --filter vite-example dev
```
### Code style

The code style is controlled by [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/). Run to check that the code style is ok:

```shell
pnpm lint
```

You aren't required to run the check manually, the CI will do it. Run the following command to fix style issues (not all issues can be fixed automatically):

```shell
pnpm lint:fix
```

### How to test

Tests are located in `__tests__` folder and run by [vitest](https://vitest.dev/) in [jsdom](https://github.com/jsdom/jsdom) environment.

To run tests you can use IDE instruments or just run:

```shell
pnpm test
```

To run tests once with a coverage report:

```shell
pnpm test:coverage
```

To check the distributive TypeScript declarations, build the project and run:

```shell
pnpm test:dts
```

### API reference docs

The API reference is generated from the source with [TypeDoc](https://typedoc.org/). Regenerate it into the (git-ignored) `docs/` folder with:

```shell
pnpm docs
```

### How to publish

Releases are managed with [changesets](https://github.com/changesets/changesets).

When you make a change that should be released, add a changeset to your pull request:

```shell
pnpm changeset
```

This prompts you to select the bump type (`major`, `minor`, or `patch`) and to write a summary that becomes the changelog entry. Commit the generated file in `.changeset/` along with your changes.

When PRs with changesets are merged to `main`, the [release workflow](.github/workflows/release.yml) opens (or updates) a "Version Packages" pull request that bumps the version and updates the changelog. Merging that pull request builds the package and publishes it to NPM.
