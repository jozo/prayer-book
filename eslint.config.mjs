import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import stylistic from "@stylistic/eslint-plugin";
import globals from "globals";

export default [
  {
    ignores: ["dist/**", "android/**", "public/*.json", "node_modules/**", "test-results/**", "playwright-report/**"]
  },

  js.configs.recommended,
  // In eslint-plugin-vue 10, Vue 3 is the default (no 'vue3-' prefix).
  ...pluginVue.configs["flat/recommended"],

  // Script-block formatting. ESLint 10 dropped the core formatting rules, so this comes from
  // @stylistic. Settings match the existing codebase rather than the deleted .prettierrc.json,
  // which the source never actually followed.
  stylistic.configs.customize({
    indent: 2,
    quotes: "double",
    semi: true,
    commaDangle: "never",
    braceStyle: "1tbs"
  }),

  {
    rules: {
      // This repo writes import and object braces unspaced: import {ref} from "vue"
      "@stylistic/object-curly-spacing": ["error", "never"],
      // Leave existing key quoting alone; the store deliberately uses {"custom": {}}
      "@stylistic/quote-props": "off"
    }
  },

  {
    // Inside SFCs, @stylistic/indent fights vue-eslint-parser. vue/script-indent is the
    // parser-aware equivalent.
    files: ["**/*.vue"],
    rules: {
      "@stylistic/indent": "off",
      "vue/script-indent": ["error", 2, {baseIndent: 0}]
    }
  },

  {
    files: ["**/*.{js,mjs,cjs,vue}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        // Replaced by Vite with the package.json version
        __APP_VERSION__: "readonly"
      }
    }
  },

  // CommonJS Node files (postcss config)
  {
    files: ["postcss.config.js", "**/*.cjs"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node
      }
    }
  },

  // ESM Node files (build script, vite/eslint/playwright config, e2e tests)
  {
    files: ["compilePrayers.mjs", "vite.config.mjs", "eslint.config.mjs", "playwright.config.mjs", "e2e/**/*.js", "screenshots/**/*.js", "playwright.screenshots.config.mjs"],
    languageOptions: {
      sourceType: "module",
      globals: {
        ...globals.node
      }
    }
  }
];
