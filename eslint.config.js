import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import globals from 'globals'

export default [
  {
    ignores: ['dist/**', 'android/**', 'public/*.json', 'node_modules/**']
  },

  js.configs.recommended,
  // In eslint-plugin-vue 10, Vue 3 is the default: 'flat/essential' replaces 'vue3-essential'
  ...pluginVue.configs['flat/essential'],

  {
    files: ['**/*.{js,mjs,cjs,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser
      }
    }
  },

  // CommonJS Node files (build script, postcss config)
  {
    files: ['compilePrayers.js', 'postcss.config.js', '**/*.cjs'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node
      }
    }
  },

  // ESM Node files (vite/eslint config)
  {
    files: ['vite.config.js', 'eslint.config.js'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.node
      }
    }
  },

  skipFormatting
]
