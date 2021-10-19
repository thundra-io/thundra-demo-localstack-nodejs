const config = {
    testPathIgnorePatterns: ['./__tests__/config'],
    setupFilesAfterEnv: ['./__tests__/config/extensions/expect-eventually.js'],
    name: 'jest-thundra-tryer',
    verbose: true,
    testRunner: 'jest-circus/runner',
    testEnvironment: '@thundra/core/dist/bootstrap/foresight/jest/JestDefaultEnvironment.js'
};

module.exports = config;

