import { fixupConfigRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import json from 'eslint-plugin-json';
import reactCompiler from 'eslint-plugin-react-compiler';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all
});

export default defineConfig([
	globalIgnores([
		'node_modules',
		'**/tsconfig.json',
		'**/lib',
		'**/dist',
		'**/build',
		'**/.next',
		'**/.turbo',
		'**/coverage'
	]),
	{
		extends: fixupConfigRules(
			compat.extends(
				'plugin:@typescript-eslint/recommended',
				'prettier',
				'plugin:prettier/recommended',
				'plugin:react/recommended'
			)
		),

		plugins: {
			reactCompiler,
			json
		},

		languageOptions: {
			globals: {
				...globals.node,
				...globals.jest,
				globalThis: 'readonly',
				React: true,
				JSX: true,
				RequestInit: true,
				browser: true,
				chrome: true,
				BigInt: true
			},
			parser: tsParser,
			ecmaVersion: 2025,
			sourceType: 'module',
			parserOptions: {
				allowImportExportEverywhere: true,

				ecmaFeatures: {
					jsx: true,
					experimentalObjectRestSpread: true
				}
			}
		},

		settings: {
			react: {
				version: 'detect'
			}
		},

		rules: {
			'no-console': 0,
			'no-debugger': 0,
			'typescript/no-type-alias': 0,
			'interface-over-type-literal': 0,
			'@typescript-eslint/explicit-module-boundary-types': 0,
			'@typescript-eslint/camelcase': 'off',
			'@typescript-eslint/ban-ts-comment': 'off',

			camelcase: 'warn',

			'prettier/prettier': [
				'error',
				{
					endOfLine: 'auto'
				}
			],

			'@typescript-eslint/prefer-interface': 0,
			'@typescript-eslint/explicit-function-return-type': 0,
			'@typescript-eslint/no-unused-vars': 'error',
			'@typescript-eslint/interface-name-prefix': 0,
			'@typescript-eslint/no-use-before-define': 0,
			'@typescript-eslint/no-non-null-assertion': 0,
			'@typescript-eslint/ban-ts-ignore': 0,
			'@typescript-eslint/no-empty-function': 0,
			'@typescript-eslint/no-require-imports': 0,

			'no-alert': 'error',
			'no-empty-function': 'off',
			'require-await': 'warn',
			'no-duplicate-imports': 'warn',
			'no-dupe-class-members': 'warn',
			'no-multiple-empty-lines': 'warn',
			'react/jsx-uses-vars': 'error',
			'react/no-unescaped-entities': 0,
			'react/prop-types': 0,
			'react/display-name': 0,

			'react/no-unknown-property': [
				'error',
				{
					ignore: ['css']
				}
			],

			'no-array-constructor': 'error',
			'no-undef': 'error',
			'prefer-const': 'error',

			'one-var': [
				'error',
				{
					let: 'never',
					const: 'never'
				}
			],

			'no-unused-vars': 'off',
			'prefer-destructuring': 0,
			'prefer-object-spread': 'error',
			'prefer-rest-params': 'error'
		}
	}
]);
