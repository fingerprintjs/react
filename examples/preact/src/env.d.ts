// Preact CLI inlines PREACT_APP_* environment variables at build time.
// Declare just the ones this example reads so TypeScript knows about `process`
// without pulling in all of @types/node into a browser app.
declare const process: {
  env: {
    PREACT_APP_FPJS_PUBLIC_API_KEY?: string
    PREACT_APP_FPJS_REGION?: string
  }
}
