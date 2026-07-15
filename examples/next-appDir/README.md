This example demonstrates the usage of Fingerprint inside Next 14's `app` directory approach.\
Note how you can use Fingerprint inside a React Server Component without issues as it is correctly executed in the browser only.
See [../next](../next/README.md) for an example using the classic `pages` approach.

## Setting up

### Fingerprint Public API key

In order to try out this example: 
1. Create a `.env` (or `.env.local`) file in this directory.
2. Set the `NEXT_PUBLIC_FPJS_PUBLIC_API_KEY` environment variable to the value of your Fingerprint Public API key. 

To get the API key:

- Go to Fingerprint Dashboard > [API Keys](https://dashboard.fingerprint.com/api-keys) and find it there.
- If you don't have a Fingerprint account, [sign up for free](https://dashboard.fingerprint.com/signup).

### Installing dependencies

From the repository root, install dependencies and build the SDK:

```shell
pnpm install
pnpm build
```

After setting the API key, start the example:

```shell
pnpm --filter next-appDir dev
```

Runs the app in the development mode.\
Open [http://localhost:3003](http://localhost:3003) to view it in the browser.
