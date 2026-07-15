import { includeIgnoreFile } from 'eslint/config'
import path from 'path'
import { fileURLToPath } from 'url'
import cfg from '@fingerprintjs/eslint-config-dx-team/type-checked'
import tseslint from 'typescript-eslint'
import nextConfig from 'eslint-config-next/core-web-vitals'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const config = [
  includeIgnoreFile(path.resolve(__dirname, '.gitignore')),
  { ignores: ['examples/'] },
  ...cfg,
  ...nextConfig,
  // eslint-config-next overrides the parser to @babel/eslint-parser for all files, then
  // restores @typescript-eslint/parser only for .ts/.tsx. Re-apply it here for .js files
  // so that the ESLint v10-compatible scope manager is used everywhere.
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    languageOptions: { parser: tseslint.parser },
  },
  // Point the type-aware rules at a lint-only tsconfig that covers the tests and
  // root config files, not just `src` (the build tsconfig). Must come after
  // nextConfig so its parser swap doesn't strip the typed parser off .tsx files.
  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.eslint.json',
        tsconfigRootDir: __dirname,
      },
    },
  },
  // Pure-JS config/scripts can't join a TS program; disable the type-aware rules there.
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    ...tseslint.configs.disableTypeChecked,
  },
  // vitest matchers like `expect.any()` return `any`, so asserting on mock call
  // args trips no-unsafe-assignment. Relax it for tests only.
  {
    files: ['__tests__/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
    },
  },
  {
    settings: {
      react: { version: '18.2' },
    },
    rules: {
      'react/display-name': 'off',
      'react/self-closing-comp': ['error', { component: true, html: true }],
      'react/react-in-jsx-scope': 'off',
      '@next/next/no-html-link-for-pages': 'off',
    },
  },
]

export default config
