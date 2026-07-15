module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/config/jest/setup.js"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  roots: ["<rootDir>/src"],
  // JavaScript `*-test.js` files are the legacy Enzyme suite. Keep them out
  // of the React 19 test project until each file has been migrated.
  testMatch: ["**/?(*.)+(spec|test).+(ts|tsx)"],
  testPathIgnorePatterns: ["<rootDir>/othersrc/", "-test\\.js$"],
};
