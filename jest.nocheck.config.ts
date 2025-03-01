console.log("===== Using @swc/jest ======");

module.exports = {
	transform: {
		"^.+\\.(t|j)sx?$": "@swc/jest",
	},
	coveragePathIgnorePatterns: ["<rootDir>/src/test/"],
	setupFilesAfterEnv: ["<rootDir>/src/test/jest.matchers.ts"],
};
