/** @type {import('jest').Config} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	roots: ['<rootDir>/src', '<rootDir>/example/src'],
	testMatch: ['**/src/**/*.spec.ts', '**/src/**/*.spec.tsx'],
	collectCoverageFrom: ['src/**/*.ts', '!src/**/*.spec.ts', '!src/**/__tests__/**'],
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
	transform: {
		'^.+\\.(ts|tsx)$': [
			'ts-jest',
			{
				tsconfig: {
					esModuleInterop: true,
					allowSyntheticDefaultImports: true,
					jsx: 'react'
				}
			}
		]
	},
	testTimeout: 30000 // 30 seconds for slow initialization
};
