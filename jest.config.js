module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  setupFiles: [
    './tests/config/setupTests.js',
  ],
  moduleFileExtensions: [
    'js',
    'json',
    'vue',
  ],
  transform: {
    '.*\\.(vue)$': 'vue-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverage: true,
  collectCoverageFrom: ['**/*.{js,vue}', '!**/node_modules/**'],
  coveragePathIgnorePatterns: [
    'src/main.js',
  ],
};
