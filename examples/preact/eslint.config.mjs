import preactConfig from 'eslint-config-preact'
import prettierConfig from 'eslint-plugin-prettier/recommended'
import tseslint from 'typescript-eslint'

const config = [
  { ignores: ['build/'] },
  ...preactConfig,
  ...tseslint.configs.recommended,
  {
    rules: {
      'prefer-const': 'error',
      curly: ['error', 'all'],
    },
  },
  prettierConfig,
]

export default config
