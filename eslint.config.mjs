// @ts-check

import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import astro from 'eslint-plugin-astro'
import prettier from 'eslint-plugin-prettier/recommended'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import neostandard from 'neostandard'
import tseslint from 'typescript-eslint'

// Rules the previous standard-with-typescript config turned off, kept off here
// so this migration does not change which code fails linting.
/** @type {import('eslint').Linter.RulesRecord} */
const relaxedRules = {
  '@typescript-eslint/explicit-function-return-type': 'off',
  '@typescript-eslint/no-confusing-void-expression': 'off',
  '@typescript-eslint/no-misused-promises': 'off',
  '@typescript-eslint/no-non-null-assertion': 'off',
  '@typescript-eslint/promise-function-async': 'off',
  '@typescript-eslint/strict-boolean-expressions': 'off',
  'react/react-in-jsx-scope': 'off',

  // Newly reachable through typescript-eslint's recommendedTypeChecked preset.
  // They flag long-standing patterns around the untyped `details` JSON columns
  // and the TMDB responses, which is a cleanup of its own.
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/no-unsafe-assignment': 'off',
  '@typescript-eslint/no-unsafe-member-access': 'off',
  '@typescript-eslint/no-unsafe-return': 'off',

  // New in eslint-plugin-react-hooks v7, which folds in the React Compiler
  // diagnostics. Both flag existing hooks that behave correctly today.
  'react-hooks/immutability': 'off',
  'react-hooks/set-state-in-effect': 'off',

  // `void somePromise()` is the codebase's way of marking a promise as
  // deliberately unawaited, which is what eslint-config-standard allowed.
  'no-void': ['error', { allowAsStatement: true }],
}

const JS_FILES = ['**/*.{js,jsx,mjs,cjs,ts,tsx}']

export default defineConfig(
  globalIgnores([
    '.astro/',
    '.vercel/',
    '.wrangler/',
    'dist/',
    'public/',
    'src/env.d.ts',
    // Inline <script> blocks that eslint-plugin-astro extracts into virtual
    // files. They run in the browser rather than the TypeScript project, and
    // Prettier cannot parse the ones using Astro's define:vars.
    '**/*.astro/*.{js,ts}',
  ]),

  js.configs.recommended,

  // neostandard is the flat-config successor to the deprecated
  // standard-with-typescript. Its JSX rules are opted out of because they apply
  // to every file, including .astro templates that only look like JSX.
  ...neostandard({ ts: true, noStyle: true, noJsx: true }),

  tseslint.configs.recommendedTypeChecked,
  {
    files: JS_FILES,
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: { jsx: true },
      },
    },
  },

  ...astro.configs.recommended,
  {
    // astro-eslint-parser has no projectService support, so point the
    // type-aware rules at the tsconfig directly for .astro files.
    files: ['**/*.astro'],
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  {
    files: JS_FILES,
    ...react.configs.flat.recommended,
    settings: { react: { version: 'detect' } },
  },
  {
    files: JS_FILES,
    ...reactHooks.configs.flat.recommended,
  },

  // This config file is not part of the TypeScript project, so type-aware
  // rules cannot run on it.
  {
    files: ['eslint.config.mjs'],
    ...tseslint.configs.disableTypeChecked,
  },

  prettier,
  { rules: relaxedRules }
)
