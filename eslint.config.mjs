import { includeIgnoreFile } from 'eslint/config'
import path from 'path'
import { fileURLToPath } from 'url'
import cfg from '@fingerprintjs/eslint-config-dx-team/type-checked'
import react from '@eslint-react/eslint-plugin'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const config = [
  includeIgnoreFile(path.resolve(__dirname, '.gitignore')),
  { ignores: ['examples/'] },
  ...cfg,
  {
    files: ['**/*.{ts,tsx}'],
    ...react.configs['recommended-type-checked'],
  },
  reactHooks.configs.flat['recommended-latest'],
  // Point the type-aware rules at a lint-only tsconfig that covers the tests and
  // root config files, not just `src` (the build tsconfig).
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
]

export default config
