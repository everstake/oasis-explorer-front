module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  setupFiles: [
    './tests/config/jest.init.js',
  ],
  moduleFileExtensions: [
    'js',
    'json',
    'vue',
    'scss',
  ],
  transform: {
    '.*\\.(vue)$': 'vue-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{js,vue}', '!**/node_modules/**'],
  coveragePathIgnorePatterns: [
    'src/main.js',
  ],
  coverageReporters: ['html', 'text-summary'],
};
