import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import pluginQuery from '@tanstack/eslint-plugin-query'

const eslintConfig = defineConfig([
  // Include the TanStack Query recommended flat config first
  ...pluginQuery.configs['flat/recommended'],
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
]);

export default eslintConfig;