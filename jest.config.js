module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,vue}',
  ],
  coveragePathIgnorePatterns: [
    'src/main.js',
  ],
  setupFiles: [
    './tests/config/setupTests.js',
  ],
};
