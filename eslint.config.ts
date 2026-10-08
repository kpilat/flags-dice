import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import eslintPluginAstro from 'eslint-plugin-astro';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  globalIgnores(['dist/', '.astro/']),

  js.configs.recommended,
  tseslint.configs.recommended,
  tseslint.configs.stylistic,

  // Type-aware rules for real .ts files only: the project service cannot see the virtual
  // `*.astro/N_N.ts` <script> files, and the parse error silently leaves them unlinted.
  {
    files: ['**/*.{ts,mts,cts}'],
    ignores: ['**/*.astro/*.ts'],
    extends: [
      tseslint.configs.recommendedTypeCheckedOnly,
      tseslint.configs.stylisticTypeCheckedOnly,
    ],
    languageOptions: {
      parserOptions: { projectService: true },
    },
  },

  // .astro files: parser, <script> processor, Astro rules and accessibility rules
  // (the latter come from eslint-plugin-jsx-a11y-x).
  eslintPluginAstro.configs.recommended,
  eslintPluginAstro.configs['jsx-a11y-recommended'],
  // Frontmatter is TypeScript that `astro check` type-checks: apply the eslint:recommended
  // adjustments typescript-eslint makes for .ts files (no-undef off, no-var on, ...).
  { files: ['**/*.astro'], rules: { ...tseslint.configs.eslintRecommended.rules } },
  // ...but `astro check` skips is:inline scripts, so keep no-undef for <script> blocks. The DOM
  // libs let it resolve type-only names such as NodeListOf.
  {
    files: ['**/*.astro/*.ts'],
    languageOptions: { parserOptions: { lib: ['esnext', 'dom', 'dom.iterable'] } },
    rules: { 'no-undef': 'error' },
  },

  {
    files: ['src/**/*.{js,mjs,ts,mts}'],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['*.{js,mjs,cjs,ts,mts,cts}'],
    languageOptions: { globals: globals.node },
  },

  {
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
      reportUnusedInlineConfigs: 'error',
    },
    rules: {
      eqeqeq: ['error', 'smart'],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-import-type-side-effects': 'error',
    },
  },

  // Must stay last: turns off the rules that would fight Prettier.
  eslintConfigPrettier,
);
