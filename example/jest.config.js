module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	roots: ['<rootDir>/src'],
	testMatch: ['**/*.spec.tsx'],
	collectCoverageFrom: [
		'src/**/*.{ts,tsx}',
		'!src/**/*.d.ts',
		'!src/**/*.spec.ts',
		'!src/test-helpers.ts'
	],
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json']
};
