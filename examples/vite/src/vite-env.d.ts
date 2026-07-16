/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FPJS_PUBLIC_API_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
