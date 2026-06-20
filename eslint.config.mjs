import { includeIgnoreFile } from 'eslint/config'
import path from 'path'
import { fileURLToPath } from 'url'
import cfg from '@fingerprintjs/eslint-config-dx-team'
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
