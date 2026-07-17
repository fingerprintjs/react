// The build-time env vars are inlined by preact.config.js's DefinePlugin.
// Declare just the ones this example reads so TypeScript knows about `process`
// without pulling in all of @types/node into a browser app.
declare const process: {
  env: {
    PREACT_APP_FPJS_PUBLIC_API_KEY?: string
    PREACT_APP_FPJS_REGION?: string
  }
}
