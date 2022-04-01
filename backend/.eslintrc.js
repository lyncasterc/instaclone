module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'no-console': 0,
    'no-underscore-dangle': ['error', { 'allow': [ '_id', '__v'] }],
    'no-param-reassign': ['error', { 'props': false }],
  },
  ignorePatterns: [
    '.eslintrc.js',
    'build',
  ],
};
