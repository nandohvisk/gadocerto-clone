// @ts-nocheck
// ESLint v9 — Flat Config com compatibilidade para configs "extends"
const { FlatCompat } = require("@eslint/eslintrc");
const tseslint = require("@typescript-eslint/eslint-plugin");
const tsparser = require("@typescript-eslint/parser");

// Conversor para configs antigas (ex.: "next/core-web-vitals")
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/** @type {import("eslint").Linter.FlatConfig[]} */
module.exports = [
  // Ignorar pastas/arquivos de build
  {
    ignores: ["node_modules/**", ".next/**", "sanity.config.ts", "sanity.cli.ts"],
  },

  // Config do Next importada via compat (equivalente a "extends: next/core-web-vitals")
  ...compat.extends("next/core-web-vitals"),

  // Regras e parser para TypeScript
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn"],
      "@typescript-eslint/no-explicit-any": "off",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];
