/** @type {import('jest').Config} */
module.exports = {
  rootDir: "./",
  roots: ["<rootDir>"],
  testEnvironment: "node",
  globals: {
    "ts-jest": {
      isolatedModules: true,
    },
  },
  collectCoverage: true,
  modulePathIgnorePatterns: ["<rootDir>/dist"],
  coveragePathIgnorePatterns: ["/node_modules", "/test"],
  testTimeout: 30000,
};
