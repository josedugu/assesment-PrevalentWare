/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ["js", "ts", "tsx"],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleNameMapper: {
    '^/(.*)\\.(ts|tsx)$': '<rootDir>/$1.js',
    '^@/(.*)$': '<rootDir>/$1', // Preserva la estructura de carpetas para las importaciones con '@'
  },
};