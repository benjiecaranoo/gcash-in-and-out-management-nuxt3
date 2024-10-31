// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // Your custom configs here
  {
    rules: {
      'no-console': 'off',
      '@typescript-eslint/await-thenable': 'error',
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      'functional/no-let': 'error',
      'no-var': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      eqeqeq: ['error', 'always'],
      'vue/eqeqeq': ['error', 'always'],
      'vue/no-required-prop-with-default': ['error'],
      'vue/component-api-style': [
        'error',
        ['script-setup', 'composition'], // "script-setup", "composition", "composition-vue2", or "options"
      ],
    },
  }
)
