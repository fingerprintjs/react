import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

const config = [
  { ignores: ['build/'] },
  ...compat.extends('preact'),
  ...tseslint.configs.recommended,
  {
    rules: {
      semi: ['error', 'never'],
      'linebreak-style': ['error', 'unix'],
      'prefer-const': 'error',
      '@typescript-eslint/no-unused-vars': ['error'],
      curly: [2, 'all'],
    },
  },
]

export default config
