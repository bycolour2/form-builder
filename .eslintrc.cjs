module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  // plugins: ['react-refresh'],
  // rules: {
  // 'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
  // },
  extends: [
    'react-app',
    'react-app/jest',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  plugins: ['prettier'],
  rules: {
    'react/jsx-no-target-blank': 'off',
  },
};
