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
  {
    ignores: ['examples/**/build/**', 'examples/**/dist/**', 'examples/**/.next/**', 'examples/**/node_modules/**'],
  },
  ...cfg,
  {
    files: ['**/*.{ts,tsx}'],
    ...react.configs['recommended-type-checked'],
  },
  reactHooks.configs.flat['recommended-latest'],
  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.eslint.json',
        tsconfigRootDir: __dirname,
      },
    },
  },
  {
    files: ['examples/preact/**/*.{ts,tsx}', 'examples/**/vite.config.ts'],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    files: ['__tests__/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
    },
  },
]

export default config
