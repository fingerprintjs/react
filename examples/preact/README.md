## Setting up

### Fingerprint Public API key

In order to try out this example: 

1. Create a `.env` (or `.env.local`) file in this directory.
2. Set the `PREACT_APP_FPJS_PUBLIC_API_KEY` environment variable to the value of your Fingerprint Public API key. 

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
pnpm --filter preact-example dev
```

Runs the app in the development mode.\
Open [http://localhost:8080](http://localhost:8080) to view it in the browser.

## Learn More

To learn more about Preact, take a look at the following resources:

- [Preact Documentation](https://preactjs.com/) - learn about Preact features and API.
- [Preact CLI Readme](https://github.com/developit/preact-cli/blob/master/README.md) - detailed explanation on how things work.
