module.exports = {
  testEnvironment: "jsdom",
  moduleFileExtensions: ["js", "jsx", "json", "node"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(svg)$": "<rootDir>/path/to/svg-transformer.js",
  },
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/build/"],
  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
    "!<rootDir>/node_modules/",
    "!<rootDir>/build/",
  ],
  coverageReporters: ["html", "text-summary"],
  verbose: true,
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
};
