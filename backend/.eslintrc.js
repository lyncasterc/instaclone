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
    project: ['backend/tsconfig.json']
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'no-console': 0,
  },
  ignorePatterns: [
    ".eslintrc.js",
    'build',
  ],
};
