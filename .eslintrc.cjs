// @ts-check

/** @type {import("eslint").ESLint.ConfigData["rules"]} */
const disabledTypescriptEslintRules = {
  '@typescript-eslint/explicit-function-return-type': 'off',
  '@typescript-eslint/no-non-null-assertion': 'off',
  '@typescript-eslint/no-confusing-void-expression': 'off',
  '@typescript-eslint/strict-boolean-expressions': 'off',
  '@typescript-eslint/promise-function-async': 'off',
  '@typescript-eslint/no-misused-promises': 'off',
  'react/react-in-jsx-scope': 'off',
}

/** @type {import("eslint").ESLint.ConfigData} */
const eslintConfig = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:astro/recommended',
    'standard-with-typescript',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    project: ['./tsconfig.json'],
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    ...disabledTypescriptEslintRules,
  },
  ignorePatterns: ['.eslintrc.cjs', 'env.d.ts'],
  overrides: [
    {
      files: ['*.astro'],
      extends: ['standard-with-typescript', 'plugin:prettier/recommended'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
      rules: {
        ...disabledTypescriptEslintRules,
      },
    },
    {
      files: ['*.{js,jsx,ts,tsx}'],
      extends: [
        'standard-with-typescript',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:prettier/recommended',
      ],
      settings: {
        react: {
          version: 'detect',
        },
      },
      rules: {
        ...disabledTypescriptEslintRules,
      },
    },
  ],
}

module.exports = eslintConfig
