module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', '**/*.md'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'simple-import-sort', '@stylistic'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@typescript-eslint/no-unused-vars': 'off', // https://github.com/typescript-eslint/typescript-eslint/issues/4641
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    '@stylistic/padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: ['return', 'export'] },
      { blankLine: 'never', prev: 'export', next: 'export' },
      {
        blankLine: 'always',
        prev: 'import',
        next: ['const', 'let', 'function', 'block-like', 'interface'],
      },
      {
        blankLine: 'always',
        prev: [
          'multiline-expression',
          'multiline-block-like',
          'multiline-const',
          'interface',
        ],
        next: '*',
      },
      {
        blankLine: 'always',
        prev: '*',
        next: [
          'multiline-expression',
          'multiline-block-like',
          'multiline-const',
          'interface',
        ],
      },
      {
        blankLine: 'never',
        prev: ['singleline-const', 'singleline-let', 'singleline-var'],
        next: ['singleline-const', 'singleline-let', 'singleline-var'],
      },
    ],
  },
};
