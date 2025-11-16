import * as ts from 'typescript/lib/tsserverlibrary';
import fs from 'fs';
import path from 'path';

// Import the plugin factory
const pluginFactory = require('../../plugin/src/index');

export interface ElementExpectation {
	elementId: number;
	description?: string;
	invalidClasses: string[];
	validClasses: string[];
}

export interface TestCase {
	functionName: string;
	lineNumber: number;
	shouldBeValid: boolean; // true for ✅, false for ❌
	comment: string;
	expectedInvalidClasses: string[]; // For simple cases, which classes should be flagged
	expectedValidClasses: string[]; // For simple cases, which should NOT be flagged
	elementExpectations: ElementExpectation[]; // For complex multi-element cases
}

/**
 * Parse a test file to extract test cases from JSDoc-style comments
 * Format:
 * /**
 *  * ✅ Valid: Description
 *  * @invalidClasses [class1, class2]  // optional, for invalid cases
 *  * @validClasses [class3, class4]    // optional, for mixed cases
 *  *
 *  * OR for multi-element cases:
 *  * @element {1} Description
 *  * @invalidClasses {1} [class1]
 *  * @validClasses {1} [class2]
 *  *\/
 */
export function parseTestFile(filePath: string): TestCase[] {
	const content = fs.readFileSync(filePath, 'utf-8');
	const lines = content.split('\n');
	const testCases: TestCase[] = [];

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];

		// Check for JSDoc comment start: /**
		const jsdocStart = line.match(/^\/\*\*/);

		if (jsdocStart) {
			// Parse JSDoc format
			let isValid: boolean | null = null;
			let comment = '';
			let expectedInvalidClasses: string[] = [];
			let expectedValidClasses: string[] = [];
			const elementExpectations: ElementExpectation[] = [];
			const elementMap: Map<number, Partial<ElementExpectation>> = new Map();

			// Read through the JSDoc block
			for (let j = i + 1; j < Math.min(i + 50, lines.length); j++) {
				const jsdocLine = lines[j];

				// Check for end of JSDoc
				if (jsdocLine.match(/\*\//)) {
					break;
				}

				// Extract the status line (✅ or ❌)
				const statusMatch = jsdocLine.match(/^\s*\*\s*(✅|❌)\s*(.+)/);
				if (statusMatch && isValid === null) {
					isValid = statusMatch[1] === '✅';
					comment = statusMatch[2].trim();
				}

				// Extract @element {id} description
				const elementMatch = jsdocLine.match(/^\s*\*\s*@element\s*\{(\d+)\}\s*(.+)/);
				if (elementMatch) {
					const elementId = parseInt(elementMatch[1]);
					const description = elementMatch[2].trim();
					if (!elementMap.has(elementId)) {
						elementMap.set(elementId, {
							elementId,
							description,
							invalidClasses: [],
							validClasses: []
						});
					} else {
						elementMap.get(elementId)!.description = description;
					}
				}

				// Extract @invalidClasses with optional element id
				const invalidMatch = jsdocLine.match(
					/^\s*\*\s*@invalidClasses\s*(?:\{(\d+)\}\s*)?\[([^\]]+)\]/
				);
				if (invalidMatch) {
					if (invalidMatch[1]) {
						// Element-specific
						const elementId = parseInt(invalidMatch[1]);
						if (!elementMap.has(elementId)) {
							elementMap.set(elementId, { elementId, invalidClasses: [], validClasses: [] });
						}
						elementMap.get(elementId)!.invalidClasses = invalidMatch[2]
							.split(',')
							.map(c => c.trim());
					} else {
						// Global
						expectedInvalidClasses = invalidMatch[2].split(',').map(c => c.trim());
					}
				}

				// Extract @validClasses with optional element id
				const validMatch = jsdocLine.match(
					/^\s*\*\s*@validClasses\s*(?:\{(\d+)\}\s*)?\[([^\]]+)\]/
				);
				if (validMatch) {
					if (validMatch[1]) {
						// Element-specific
						const elementId = parseInt(validMatch[1]);
						if (!elementMap.has(elementId)) {
							elementMap.set(elementId, { elementId, invalidClasses: [], validClasses: [] });
						}
						elementMap.get(elementId)!.validClasses = validMatch[2].split(',').map(c => c.trim());
					} else {
						// Global
						expectedValidClasses = validMatch[2].split(',').map(c => c.trim());
					}
				}
			}

			// Convert element map to array
			elementMap.forEach(el => {
				elementExpectations.push({
					elementId: el.elementId!,
					description: el.description,
					invalidClasses: el.invalidClasses || [],
					validClasses: el.validClasses || []
				});
			});

			// Sort by element ID
			elementExpectations.sort((a, b) => a.elementId - b.elementId);

			// Look for the next function declaration
			if (isValid !== null) {
				for (let j = i + 1; j < Math.min(i + 50, lines.length); j++) {
					const functionMatch = lines[j].match(/export function (\w+)/);
					if (functionMatch) {
						testCases.push({
							functionName: functionMatch[1],
							lineNumber: i + 1,
							shouldBeValid: isValid,
							comment: comment,
							expectedInvalidClasses: expectedInvalidClasses,
							expectedValidClasses: expectedValidClasses,
							elementExpectations: elementExpectations
						});
						break;
					}
				}
			}
		}
	}

	return testCases;
}

/**
 * Create a test environment and run plugin diagnostics
 */
export async function runPluginOnFile(
	testFilePath: string
): Promise<{ diagnostics: ts.Diagnostic[]; sourceCode: string }> {
	const tempDir = path.dirname(testFilePath);
	const cssFile = path.join(tempDir, 'global.css');

	// Create TypeScript config
	const tsconfig = path.join(tempDir, 'tsconfig.json');
	if (!fs.existsSync(tsconfig)) {
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
	}

	// Create TypeScript project
	const configPath = ts.findConfigFile(tempDir, ts.sys.fileExists, 'tsconfig.json');
	const configFile = ts.readConfigFile(configPath!, ts.sys.readFile);
	const parsedConfig = ts.parseJsonConfigFileContent(configFile.config, ts.sys, tempDir);

	// Create language service
	const languageService = ts.createLanguageService(
		{
			getCompilationSettings: () => parsedConfig.options,
			getScriptFileNames: () => [testFilePath],
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
	const mockInfo = {
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
			globalCss: cssFile
		},
		serverHost: {} as unknown as ts.server.ServerHost
	};

	// Initialize plugin
	const plugin = pluginFactory({ typescript: ts });
	const proxy = plugin.create(mockInfo);

	// Wait for validator to initialize
	await plugin.getInitializationPromise();

	// Get diagnostics
	const diagnostics = proxy.getSemanticDiagnostics(testFilePath);
	const sourceCode = fs.readFileSync(testFilePath, 'utf-8');

	return { diagnostics, sourceCode };
}

/**
 * Get diagnostics for a specific function in the source code
 */
export function getDiagnosticsForFunction(
	diagnostics: ts.Diagnostic[],
	sourceCode: string,
	functionName: string
): ts.Diagnostic[] {
	// Find the function's start and end positions
	const functionStartMatch = sourceCode.match(new RegExp(`export function ${functionName}\\s*\\(`));
	if (!functionStartMatch) {
		return [];
	}

	const functionStart = functionStartMatch.index!;

	// Find the closing brace of the function (simplified - assumes proper formatting)
	let braceCount = 0;
	let functionEnd = functionStart;
	let foundFirstBrace = false;

	for (let i = functionStart; i < sourceCode.length; i++) {
		if (sourceCode[i] === '{') {
			braceCount++;
			foundFirstBrace = true;
		} else if (sourceCode[i] === '}') {
			braceCount--;
			if (foundFirstBrace && braceCount === 0) {
				functionEnd = i;
				break;
			}
		}
	}

	// Filter diagnostics that are within this function's range
	return diagnostics.filter(
		d =>
			(d as { source?: string }).source === 'tw-plugin' &&
			d.start !== undefined &&
			d.start >= functionStart &&
			d.start <= functionEnd
	);
}

/**
 * Extract all class names from className attributes in a function
 */
export function getClassNamesInFunction(sourceCode: string, functionName: string): string[] {
	// Find the function's start and end positions
	const functionStartMatch = sourceCode.match(new RegExp(`export function ${functionName}\\s*\\(`));
	if (!functionStartMatch) {
		return [];
	}

	const functionStart = functionStartMatch.index!;

	// Find the closing brace of the function
	let braceCount = 0;
	let functionEnd = functionStart;
	let foundFirstBrace = false;

	for (let i = functionStart; i < sourceCode.length; i++) {
		if (sourceCode[i] === '{') {
			braceCount++;
			foundFirstBrace = true;
		} else if (sourceCode[i] === '}') {
			braceCount--;
			if (foundFirstBrace && braceCount === 0) {
				functionEnd = i;
				break;
			}
		}
	}

	const functionCode = sourceCode.substring(functionStart, functionEnd + 1);

	// Extract all className values (both string literals and JSX expressions)
	const classNamePattern = /className\s*=\s*(?:"([^"]*)"|'([^']*)'|\{'([^']*)'\}|\{"([^"]*)"\})/g;
	const allClasses: string[] = [];
	let match;

	while ((match = classNamePattern.exec(functionCode)) !== null) {
		// Get whichever group matched (1-4)
		const classNameString = match[1] || match[2] || match[3] || match[4];
		if (classNameString) {
			// Split by whitespace and filter out empty strings
			const classes = classNameString.split(/\s+/).filter(c => c.length > 0);
			allClasses.push(...classes);
		}
	}

	return allClasses;
}

/**
 * Extract the text at a diagnostic's position
 */
export function getTextAtDiagnostic(diagnostic: ts.Diagnostic, sourceCode: string): string {
	if (diagnostic.start === undefined || diagnostic.length === undefined) {
		return '';
	}
	return sourceCode.substring(diagnostic.start, diagnostic.start + diagnostic.length);
}

/**
 * Generate test assertions for a test case
 */
export function createTestAssertion(
	testCase: TestCase,
	diagnostics: ts.Diagnostic[],
	sourceCode: string,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	expect: any
): void {
	const functionDiagnostics = getDiagnosticsForFunction(
		diagnostics,
		sourceCode,
		testCase.functionName
	);

	if (testCase.shouldBeValid) {
		// Valid cases should have NO tw-plugin errors
		expect(functionDiagnostics).toHaveLength(0);
	} else {
		// Invalid cases should have at least one tw-plugin error
		expect(functionDiagnostics.length).toBeGreaterThan(0);

		// Extract all error texts from diagnostics
		const errorTexts = functionDiagnostics.map(d => getTextAtDiagnostic(d, sourceCode));

		// Check if we have element-level expectations
		if (testCase.elementExpectations.length > 0) {
			// For element-level expectations, we need to find each element's className
			// and verify its diagnostics separately
			testCase.elementExpectations.forEach(elementExpectation => {
				// For now, we'll use a simplified approach where we verify that:
				// 1. All expected invalid classes have errors
				// 2. All expected valid classes don't have errors

				if (elementExpectation.invalidClasses.length > 0) {
					elementExpectation.invalidClasses.forEach(expectedClass => {
						expect(errorTexts).toContain(expectedClass);
					});
				}

				if (elementExpectation.validClasses.length > 0) {
					elementExpectation.validClasses.forEach(validClass => {
						expect(errorTexts).not.toContain(validClass);
					});
				}
			});
		} else {
			// Use global expectations for simple cases
			// For invalid cases, @invalidClasses or @validClasses should be specified
			if (testCase.expectedInvalidClasses.length === 0 && testCase.expectedValidClasses.length === 0) {
				throw new Error(
					`Test case "${testCase.functionName}" is marked as invalid (❌) but has no @invalidClasses or @validClasses annotations. ` +
					`Please specify which classes should be invalid using @invalidClasses [class1, class2]`
				);
			}

			// Extract all classes from the function's className attributes
			const allClasses = getClassNamesInFunction(sourceCode, testCase.functionName);
			const validClassesFound = allClasses.filter(c => !errorTexts.includes(c));

			// Verify invalid classes
			if (testCase.expectedInvalidClasses.length > 0) {
				// Each expected invalid class should have an error
				testCase.expectedInvalidClasses.forEach(expectedClass => {
					expect(errorTexts).toContain(expectedClass);
				});
			}

			// IMPORTANT: Verify that all errors match expected invalid classes
			// This ensures that if @invalidClasses is empty but errors exist, the test fails
			errorTexts.forEach(errorText => {
				expect(testCase.expectedInvalidClasses).toContain(errorText);
			});

			// IMPORTANT: Verify that all valid classes (non-errors) match expected valid classes
			// This ensures that if @validClasses is empty but valid classes exist, the test fails
			if (testCase.expectedValidClasses.length > 0) {
				// Each expected valid class should NOT have an error
				testCase.expectedValidClasses.forEach(validClass => {
					expect(errorTexts).not.toContain(validClass);
				});
			}

			// Verify that all valid classes found match the expected list
			validClassesFound.forEach(validClass => {
				expect(testCase.expectedValidClasses).toContain(validClass);
			});
		}

		// Verify each diagnostic
		functionDiagnostics.forEach(diagnostic => {
			// 1. Verify the error message format
			expect(typeof diagnostic.messageText).toBe('string');
			if (typeof diagnostic.messageText === 'string') {
				expect(diagnostic.messageText).toContain('not a valid Tailwind class');
			}

			// 2. Verify the diagnostic has position information
			expect(diagnostic.start).toBeDefined();
			expect(diagnostic.length).toBeDefined();
			expect(diagnostic.length).toBeGreaterThan(0);

			// 3. Extract and verify the actual text at the error position
			const errorText = getTextAtDiagnostic(diagnostic, sourceCode);
			expect(errorText.length).toBeGreaterThan(0);

			// 4. Verify the error message mentions the class it found
			if (typeof diagnostic.messageText === 'string') {
				expect(diagnostic.messageText).toContain(errorText);
			}

			// 5. Verify the text at the position doesn't contain quotes or braces
			// (should point to just the class name, not the attribute)
			expect(errorText).not.toContain('"');
			expect(errorText).not.toContain("'");
			expect(errorText).not.toContain('{');
			expect(errorText).not.toContain('}');
		});
	}
}
