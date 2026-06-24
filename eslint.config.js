const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  ...expoConfig,
  {
    settings: {
      react: { version: '18.3.1' },
    },
    rules: {
      'no-console': 'warn',
    },
  },
  {
    files: ['scripts/**/*.js'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    ignores: ['node_modules/', '.expo/', 'dist/', 'coverage/'],
  },
]);
