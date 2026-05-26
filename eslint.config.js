import js from "@eslint/js"
import globals from "globals"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import prettierConfig from "eslint-config-prettier"
import tseslint from "typescript-eslint"

export default tseslint.config(
  {
    ignores: ["dist", "node_modules"]
  },
  {
    files: ["src/**/*.{ts,tsx}", "vite.config.ts"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "preserve-caught-error": "off",
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/immutability": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-refresh/only-export-components": "off"
    }
  },
  prettierConfig
)
