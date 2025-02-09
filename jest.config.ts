console.log("===== Using ts-jest ======");

module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	coveragePathIgnorePatterns: ["<rootDir>/src/test/"],
	setupFilesAfterEnv: ["<rootDir>/src/test/jest.matchers.ts"],
	collectCoverage: true,
	collectCoverageFrom: ["./src/**"],
	coverageThreshold: {
		global: {
			lines: 65,
		},
	},
};
