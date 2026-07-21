/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FPJS_PUBLIC_API_KEY?: string
  readonly VITE_FPJS_REGION?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
