import * as ts from 'typescript/lib/tsserverlibrary';
import fs from 'fs';
import os from 'os';
import path from 'path';

// Import the plugin factory
const pluginFactory = require('../index');

describe('TailwindTypescriptPlugin', () => {
	let tempDir: string;
	let tempCssFile: string;
	let languageService: ts.LanguageService;
	let mockInfo: ts.server.PluginCreateInfo;

	beforeAll(() => {
		// Create temporary directory and CSS file
		tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'plugin-test-'));
		tempCssFile = path.join(tempDir, 'global.css');
		fs.writeFileSync(tempCssFile, '@import "tailwindcss";');

		// Create a test TypeScript file
		const testFile = path.join(tempDir, 'test.tsx');
		const testContent = `
import React from 'react';

export function ValidComponent() {
  return <div className="flex items-center justify-center">Valid</div>;
}

export function InvalidComponent() {
  return <div className="flex invalid-class">Invalid</div>;
}

export function MixedComponent() {
  return <div className="flex items-center invalid-one hover:bg-blue-500 invalid-two">Mixed</div>;
}

export function ArbitraryValuesComponent() {
  return <div className="w-[100px] h-[50vh] bg-[#ff0000]">Arbitrary</div>;
}
`;
		fs.writeFileSync(testFile, testContent);

		// Create a minimal tsconfig
		const tsconfig = path.join(tempDir, 'tsconfig.json');
		fs.writeFileSync(
			tsconfig,
			JSON.stringify({
				compilerOptions: {
					jsx: 'react',
					target: 'es2015',
					module: 'commonjs'
				}
			})
		);

		// Create TypeScript project
		const configPath = ts.findConfigFile(tempDir, ts.sys.fileExists, 'tsconfig.json');
		const configFile = ts.readConfigFile(configPath!, ts.sys.readFile);
		const parsedConfig = ts.parseJsonConfigFileContent(configFile.config, ts.sys, tempDir);

		// Create mock language service
		languageService = ts.createLanguageService(
			{
				getCompilationSettings: () => parsedConfig.options,
				getScriptFileNames: () => [testFile],
				getScriptVersion: () => '0',
				getScriptSnapshot: (fileName: string) => {
					if (!fs.existsSync(fileName)) {
						return undefined;
					}
					return ts.ScriptSnapshot.fromString(fs.readFileSync(fileName, 'utf-8'));
				},
				getCurrentDirectory: () => tempDir,
				getDefaultLibFileName: (options: ts.CompilerOptions) => ts.getDefaultLibFilePath(options),
				fileExists: ts.sys.fileExists,
				readFile: ts.sys.readFile,
				readDirectory: ts.sys.readDirectory
			} as ts.LanguageServiceHost,
			ts.createDocumentRegistry()
		);

		// Create mock plugin info
		mockInfo = {
			languageService,
			languageServiceHost: languageService as unknown as ts.LanguageServiceHost,
			project: {
				getCurrentDirectory: () => tempDir,
				projectService: {
					logger: {
						// eslint-disable-next-line @typescript-eslint/no-unused-vars
						info: (_msg: string) => {
							// Silent logger for tests
						}
					}
				}
			} as unknown as ts.server.Project,
			config: {
				globalCss: './global.css'
			},
			serverHost: {} as unknown as ts.server.ServerHost
		};
	});

	describe('plugin initialization', () => {
		it('should create plugin instance', () => {
			const plugin = pluginFactory({ typescript: ts });
			expect(plugin).toBeTruthy();
			expect(typeof plugin.create).toBe('function');
		});

		it('should return decorated language service', async () => {
			const plugin = pluginFactory({ typescript: ts });
			const proxy = plugin.create(mockInfo);

			// Wait for initialization to complete
			const initPromise = plugin.getInitializationPromise();
			if (initPromise) {
				await initPromise;
			}

			expect(proxy).toBeTruthy();
			expect(typeof proxy.getSemanticDiagnostics).toBe('function');
		});
	});

	describe('semantic diagnostics', () => {
		it('should process TSX files with className attributes', async () => {
			const plugin = pluginFactory({ typescript: ts });
			const proxy = plugin.create(mockInfo);

			// Wait for validator to initialize
			await plugin.getInitializationPromise();

			const testFile = path.join(tempDir, 'test.tsx');
			const diagnostics = proxy.getSemanticDiagnostics(testFile);

			// Should get diagnostics (may include Tailwind errors or not)
			expect(Array.isArray(diagnostics)).toBeTruthy();
		});

		it('should validate mixed valid and invalid classes (className="flex invalid-class")', async () => {
			const plugin = pluginFactory({ typescript: ts });
			const proxy = plugin.create(mockInfo);

			// Wait for validator to initialize
			await plugin.getInitializationPromise();

			const testFile = path.join(tempDir, 'test.tsx');
			const sourceCode = fs.readFileSync(testFile, 'utf-8');
			const diagnostics = proxy.getSemanticDiagnostics(testFile);
			const tailwindErrors = diagnostics.filter(
				(d: ts.Diagnostic) => (d as { source?: string }).source === 'tw-plugin'
			);

			// Should have errors only for invalid classes, not valid ones
			expect(tailwindErrors.length > 0).toBeTruthy();

			// Check that "flex" (valid) has no error
			const flexError = tailwindErrors.find(
				(d: ts.Diagnostic) => typeof d.messageText === 'string' && d.messageText.includes('"flex"')
			);
			expect(flexError).toBeUndefined();

			// Check that "invalid-class" has an error
			const invalidClassError = tailwindErrors.find(
				(d: ts.Diagnostic) =>
					typeof d.messageText === 'string' && d.messageText.includes('invalid-class')
			);
			expect(invalidClassError).toBeTruthy();

			// Verify the error points exactly to "invalid-class", not "flex"
			const errorText = sourceCode.substring(
				invalidClassError.start!,
				invalidClassError.start! + invalidClassError.length!
			);
			expect(errorText).toBe('invalid-class');
		});

		it('should identify invalid classes in test file', async () => {
			const plugin = pluginFactory({ typescript: ts });
			const proxy = plugin.create(mockInfo);

			// Wait for validator to initialize
			await plugin.getInitializationPromise();

			const testFile = path.join(tempDir, 'test.tsx');
			const diagnostics = proxy.getSemanticDiagnostics(testFile);
			const tailwindErrors = diagnostics.filter(
				(d: ts.Diagnostic) => (d as { source?: string }).source === 'tw-plugin'
			);

			// The test.tsx file has invalid-class in it
			expect(tailwindErrors.length > 0).toBeTruthy();
			expect(
				tailwindErrors.some(
					(d: ts.Diagnostic) =>
						typeof d.messageText === 'string' && d.messageText.includes('invalid')
				)
			).toBeTruthy();
		});

		it('should provide error messages for invalid classes', async () => {
			const plugin = pluginFactory({ typescript: ts });
			const proxy = plugin.create(mockInfo);

			// Wait for validator to initialize
			await plugin.getInitializationPromise();

			const testFile = path.join(tempDir, 'test.tsx');
			const diagnostics = proxy.getSemanticDiagnostics(testFile);
			const tailwindErrors = diagnostics.filter(
				(d: ts.Diagnostic) => (d as { source?: string }).source === 'tw-plugin'
			);

			if (tailwindErrors.length > 0) {
				const firstError = tailwindErrors[0];
				expect(typeof firstError.messageText).toBe('string');
				if (typeof firstError.messageText === 'string') {
					expect(firstError.messageText.includes('not a valid Tailwind class')).toBeTruthy();
				}
				expect(firstError.category).toBe(ts.DiagnosticCategory.Error);
			}
		});

		it('should include exact position information for errors', async () => {
			const plugin = pluginFactory({ typescript: ts });
			const proxy = plugin.create(mockInfo);

			// Wait for validator to initialize
			await plugin.getInitializationPromise();

			const testFile = path.join(tempDir, 'test.tsx');
			const sourceCode = fs.readFileSync(testFile, 'utf-8');
			const diagnostics = proxy.getSemanticDiagnostics(testFile);
			const tailwindErrors = diagnostics.filter(
				(d: ts.Diagnostic) => (d as { source?: string }).source === 'tw-plugin'
			);

			expect(tailwindErrors.length > 0).toBeTruthy();

			// Find the error for "invalid-class" specifically
			const invalidClassError = tailwindErrors.find(
				(d: ts.Diagnostic) =>
					typeof d.messageText === 'string' && d.messageText.includes('invalid-class')
			);
			expect(invalidClassError).toBeTruthy();

			// Verify the error points to the exact location of "invalid-class" in the source
			const expectedText = 'invalid-class';
			const actualText = sourceCode.substring(
				invalidClassError.start,
				invalidClassError.start + invalidClassError.length
			);

			expect(actualText).toBe(expectedText);
			expect(invalidClassError.length).toBe(expectedText.length);

			// Verify the error is in the correct line (InvalidComponent)
			const lineStart = sourceCode.lastIndexOf('\n', invalidClassError.start);
			const lineEnd = sourceCode.indexOf('\n', invalidClassError.start);
			const line = sourceCode.substring(lineStart, lineEnd);
			expect(line.includes('InvalidComponent') || line.includes('className')).toBeTruthy();
		});
	});
});
