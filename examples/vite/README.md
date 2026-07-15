# Fingerprint Vite Example

This example demonstrates using Fingerprint in a React application built with Vite.

## Setting up

### Fingerprint Public API key

To try this example:

1. Create a `.env` or `.env.local` file in this directory.
2. Set `VITE_FPJS_PUBLIC_API_KEY` to your Fingerprint Public API key.

Find your API key in the Fingerprint Dashboard under [API Keys](https://dashboard.fingerprint.com/api-keys). If you do not have an account, [sign up for free](https://dashboard.fingerprint.com/signup).

### Installing dependencies

From the repository root, install dependencies and build the SDK:

```shell
pnpm install
pnpm build
```

After setting the API key, start the example:

```shell
pnpm --filter vite-example dev
```
