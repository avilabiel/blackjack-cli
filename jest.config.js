/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  rootDir: "./",
  roots: ["<rootDir>"],
  testEnvironment: "node",
  collectCoverage: true,
  modulePathIgnorePatterns: ["<rootDir>/dist"],
  coveragePathIgnorePatterns: ["/node_modules", "/test"],
  testTimeout: 30000,
  transform: {
    ".+\\.ts$": "ts-jest",
  },
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1",
    "test/(.*)": "<rootDir>/test/$1",
  },
};
