const js = require('@eslint/js')
const vue = require('eslint-plugin-vue')
const globals = require('globals')

module.exports = [

  {
    files: ['eslint.config.js'],
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  },
  
  js.configs.recommended,
  ...vue.configs['flat/recommended'],
  
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      globals: {
        ...globals.browser
      }
    }
  },

  {
    files: ['**/*.vue'],
    languageOptions: {
      globals: {
        ...globals.browser
      }
    },
    rules: {
      'indent': 'off',
      'quotes': ['error', 'single'],
      'semi': ['error', 'never'],
      'vue/html-indent': ['error', 2],
      'vue/script-indent': ['error', 2],
      'vue/multi-word-component-names': 'off'
    }
  },
  
  {
    ignores: ['node_modules/', 'dist/']
  }
]