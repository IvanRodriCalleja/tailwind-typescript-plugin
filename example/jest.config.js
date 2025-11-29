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
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
	// Performance optimizations
	maxWorkers: '50%',
	workerIdleMemoryLimit: '512MB',
	testTimeout: 30000
};
