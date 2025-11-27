import * as ts from 'typescript/lib/tsserverlibrary';
import fs from 'fs';
import path from 'path';

import pluginFactory from '../../src/index';

// Diagnostic codes from DiagnosticService
const TAILWIND_DIAGNOSTIC_CODE = 90001;
const TAILWIND_DUPLICATE_CODE = 90002;
const TAILWIND_EXTRACTABLE_CLASS_CODE = 90003;
const TAILWIND_CONFLICT_CODE = 90004;

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
	expectedDuplicateClasses: string[]; // Classes that should be flagged as duplicates
	expectedExtractableClasses: string[]; // Classes that should be flagged as extractable (hints)
	expectedConflictClasses: string[]; // Classes that should be flagged as conflicting
	elementExpectations: ElementExpectation[]; // For complex multi-element cases
	utilityFunctions?: string[]; // Optional custom utility functions to test
}

/**
 * Parse a test file to extract test cases from JSDoc-style comments
 * Format:
 * /**
 *  * ✅ Valid: Description
 *  * @invalidClasses [class1, class2]  // optional, for invalid cases
 *  * @validClasses [class3, class4]    // optional, for mixed cases
 *  * @duplicateClasses [class5, class6]  // optional, for duplicate detection
 *  * @extractableClasses [class7, class8]  // optional, for extractable hints
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
			let expectedDuplicateClasses: string[] = [];
			let expectedExtractableClasses: string[] = [];
			let expectedConflictClasses: string[] = [];
			let utilityFunctions: string[] | undefined = undefined;
			const elementExpectations: ElementExpectation[] = [];
			const elementMap: Map<number, Partial<ElementExpectation>> = new Map();

			// Read through the JSDoc block
			for (let j = i + 1; j < Math.min(i + 50, lines.length); j++) {
				const jsdocLine = lines[j];

				// Check for end of JSDoc
				if (jsdocLine.match(/\*\//)) {
					break;
				}

				// Extract the status line (✅, ❌, ⚠️, or 💡)
				const statusMatch = jsdocLine.match(/^\s*\*\s*(✅|❌|⚠️|💡)\s*(.+)/);
				if (statusMatch && isValid === null) {
					// ✅ = valid, ❌ = invalid, ⚠️ = duplicate warning, 💡 = extractable hint
					// For duplicate/extractable cases, we still mark them as "valid" in terms of class validity
					// but they have duplicate/extractable annotations
					isValid = statusMatch[1] === '✅' || statusMatch[1] === '⚠️' || statusMatch[1] === '💡';
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

				// Extract @utilityFunctions [name1, name2]
				const utilityFunctionsMatch = jsdocLine.match(/^\s*\*\s*@utilityFunctions\s*\[([^\]]+)\]/);
				if (utilityFunctionsMatch) {
					utilityFunctions = utilityFunctionsMatch[1].split(',').map(fn => fn.trim());
				}

				// Extract @duplicateClasses [class1, class2]
				const duplicateMatch = jsdocLine.match(/^\s*\*\s*@duplicateClasses\s*\[([^\]]+)\]/);
				if (duplicateMatch) {
					expectedDuplicateClasses = duplicateMatch[1].split(',').map(c => c.trim());
				}

				// Extract @extractableClasses [class1, class2]
				const extractableMatch = jsdocLine.match(/^\s*\*\s*@extractableClasses\s*\[([^\]]+)\]/);
				if (extractableMatch) {
					expectedExtractableClasses = extractableMatch[1].split(',').map(c => c.trim());
				}

				// Extract @conflictClasses [class1, class2]
				const conflictMatch = jsdocLine.match(/^\s*\*\s*@conflictClasses\s*\[([^\]]+)\]/);
				if (conflictMatch) {
					expectedConflictClasses = conflictMatch[1].split(',').map(c => c.trim());
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
							expectedDuplicateClasses: expectedDuplicateClasses,
							expectedExtractableClasses: expectedExtractableClasses,
							expectedConflictClasses: expectedConflictClasses,
							elementExpectations: elementExpectations,
							utilityFunctions: utilityFunctions
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
 * Extended test case with file path for folder-based tests
 */
export interface FolderTestCase extends TestCase {
	filePath: string;
}

/**
 * Parse all test files in a folder and extract test cases from JSDoc-style comments.
 * Each .tsx file in the folder is parsed for test cases.
 */
export function parseTestFolder(folderPath: string): FolderTestCase[] {
	const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.tsx'));
	const allTestCases: FolderTestCase[] = [];

	for (const file of files) {
		const filePath = path.join(folderPath, file);
		const testCases = parseTestFile(filePath);

		// Add file path to each test case
		for (const testCase of testCases) {
			allTestCases.push({
				...testCase,
				filePath
			});
		}
	}

	return allTestCases;
}

/**
 * Result of running the plugin on a folder
 */
export interface FolderPluginResult {
	results: Map<string, { diagnostics: ts.Diagnostic[]; sourceCode: string }>;
	plugins: PluginInstance[];
}

/**
 * Run plugin on all files in a folder and return combined diagnostics
 */
export async function runPluginOnFolder(
	folderPath: string,
	options?: RunPluginOptions | string[]
): Promise<FolderPluginResult> {
	const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.tsx'));
	const results = new Map<string, { diagnostics: ts.Diagnostic[]; sourceCode: string }>();
	const plugins: PluginInstance[] = [];

	for (const file of files) {
		const filePath = path.join(folderPath, file);
		const result = await runPluginOnFile(filePath, options);
		results.set(filePath, { diagnostics: result.diagnostics, sourceCode: result.sourceCode });
		plugins.push(result.plugin);
	}

	return { results, plugins };
}

/**
 * Options for running the plugin on a file
 */
export interface RunPluginOptions {
	utilityFunctions?: string[];
	allowedClasses?: string[];
}

/**
 * Plugin instance interface for cleanup
 */
export interface PluginInstance {
	dispose(): void;
}

/**
 * Result of running the plugin on a file
 */
export interface RunPluginResult {
	diagnostics: ts.Diagnostic[];
	sourceCode: string;
	plugin: PluginInstance;
}

/**
 * Create a test environment and run plugin diagnostics
 */
export async function runPluginOnFile(
	testFilePath: string,
	options?: RunPluginOptions | string[]
): Promise<RunPluginResult> {
	// Support legacy signature where second param is utilityFunctions array
	const opts: RunPluginOptions =
		Array.isArray(options) ? { utilityFunctions: options } : options || {};
	const tempDir = path.dirname(testFilePath);

	// Look for global.css in the current directory or parent directories
	let cssFile = path.join(tempDir, 'global.css');
	if (!fs.existsSync(cssFile)) {
		// Try parent directory
		const parentCss = path.join(tempDir, '..', 'global.css');
		if (fs.existsSync(parentCss)) {
			cssFile = parentCss;
		}
	}

	// Find TypeScript config - use ts.findConfigFile which searches parent directories
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
			globalCss: cssFile,
			...(opts.utilityFunctions && { utilityFunctions: opts.utilityFunctions }),
			...(opts.allowedClasses && { allowedClasses: opts.allowedClasses })
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

	return { diagnostics, sourceCode, plugin };
}

/**
 * Get diagnostics for a specific function in the source code.
 * Also looks for a test scope delimiter comment (// @test-scope-start) above the function
 * to include variables and other code in the test scope.
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

	const functionDeclStart = functionStartMatch.index!;

	// Look backwards for a test scope delimiter or JSDoc comment to find the real start
	// The test scope starts at either:
	// 1. A "// @test-scope-start" comment
	// 2. The JSDoc comment (/**) if no scope delimiter is found
	let testScopeStart = functionDeclStart;

	// Search backwards from the function declaration
	const beforeFunction = sourceCode.substring(0, functionDeclStart);
	const lines = beforeFunction.split('\n');

	// Find the JSDoc comment that belongs to this function (searching backwards)
	let foundJsDoc = false;

	for (let i = lines.length - 1; i >= 0; i--) {
		const line = lines[i];
		const trimmedLine = line.trim();

		// Check for scope delimiter
		if (trimmedLine === '// @test-scope-start') {
			// Calculate the position of this line
			testScopeStart = lines.slice(0, i).join('\n').length + (i > 0 ? 1 : 0);
			break;
		}

		// Check for start of JSDoc (/**)
		if (trimmedLine.startsWith('/**') && !foundJsDoc) {
			// Calculate the position of this line
			testScopeStart = lines.slice(0, i).join('\n').length + (i > 0 ? 1 : 0);
			foundJsDoc = true;
			// Don't break - keep looking for scope delimiter
		}

		// If we hit another function declaration or a section comment, stop
		if (
			trimmedLine.startsWith('export function') ||
			trimmedLine.startsWith('// ====')
		) {
			break;
		}
	}

	// Find the closing brace of the function
	let braceCount = 0;
	let functionEnd = functionDeclStart;
	let foundFirstBrace = false;

	for (let i = functionDeclStart; i < sourceCode.length; i++) {
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

	// Filter diagnostics that are within this test scope range
	return diagnostics.filter(
		d =>
			(d as { source?: string }).source === 'tw-plugin' &&
			d.start !== undefined &&
			d.start >= testScopeStart &&
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

	// Filter to only invalid class errors (not duplicate warnings)
	// Duplicate warnings (code 90002) are tested separately in duplicate-classes.spec.tsx
	const invalidClassDiagnostics = functionDiagnostics.filter(
		d => d.code === TAILWIND_DIAGNOSTIC_CODE
	);

	if (testCase.shouldBeValid) {
		// Valid cases should have NO tw-plugin invalid class errors
		// Note: We don't check for duplicate warnings here as they're not "invalid" classes
		expect(invalidClassDiagnostics).toHaveLength(0);
	} else {
		// Invalid cases should have at least one tw-plugin invalid class error
		expect(invalidClassDiagnostics.length).toBeGreaterThan(0);

		// Extract all error texts from invalid class diagnostics only
		const errorTexts = invalidClassDiagnostics.map(d => getTextAtDiagnostic(d, sourceCode));

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
			// Extract all classes from the function's className attributes
			const allClasses = getClassNamesInFunction(sourceCode, testCase.functionName);
			const validClassesFound = allClasses.filter(c => !errorTexts.includes(c));

			// IMPORTANT: Verify that all errors match expected invalid classes
			// The @invalidClasses annotation is the source of truth for what should be invalid
			errorTexts.forEach(errorText => {
				expect(testCase.expectedInvalidClasses).toContain(errorText);
			});

			// Verify that all expected invalid classes have errors
			testCase.expectedInvalidClasses.forEach(expectedClass => {
				expect(errorTexts).toContain(expectedClass);
			});

			// IMPORTANT: Verify that all valid classes (non-errors) match expected valid classes
			// The @validClasses annotation is the source of truth for what should be valid
			validClassesFound.forEach(validClass => {
				expect(testCase.expectedValidClasses).toContain(validClass);
			});

			// Verify that all expected valid classes are found and don't have errors
			testCase.expectedValidClasses.forEach(validClass => {
				expect(errorTexts).not.toContain(validClass);
			});
		}

		// Verify each invalid class diagnostic (not duplicate warnings)
		invalidClassDiagnostics.forEach(diagnostic => {
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

/**
 * Generate test assertions for duplicate class detection
 */
export function createDuplicateTestAssertion(
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

	// Filter to duplicate warnings
	const duplicateDiagnostics = functionDiagnostics.filter(d => d.code === TAILWIND_DUPLICATE_CODE);
	const duplicateTexts = duplicateDiagnostics.map(d => getTextAtDiagnostic(d, sourceCode));

	// Filter to extractable hints
	const extractableDiagnostics = functionDiagnostics.filter(
		d => d.code === TAILWIND_EXTRACTABLE_CLASS_CODE
	);
	const extractableTexts = extractableDiagnostics.map(d => getTextAtDiagnostic(d, sourceCode));

	// Check expected duplicate classes
	if (testCase.expectedDuplicateClasses.length > 0) {
		// Count expected occurrences of each class
		const expectedCounts = new Map<string, number>();
		testCase.expectedDuplicateClasses.forEach(cls => {
			expectedCounts.set(cls, (expectedCounts.get(cls) || 0) + 1);
		});

		// Count actual occurrences
		const actualCounts = new Map<string, number>();
		duplicateTexts.forEach(cls => {
			actualCounts.set(cls, (actualCounts.get(cls) || 0) + 1);
		});

		// Verify each expected class appears the correct number of times
		expectedCounts.forEach((expectedCount, cls) => {
			const actualCount = actualCounts.get(cls) || 0;
			expect(actualCount).toBe(expectedCount);
		});

		// Verify no unexpected duplicates
		duplicateTexts.forEach(text => {
			expect(testCase.expectedDuplicateClasses).toContain(text);
		});
	} else if (testCase.expectedExtractableClasses.length === 0) {
		// No duplicates expected and no extractables expected
		expect(duplicateDiagnostics.length).toBe(0);
	}

	// Check expected extractable classes
	if (testCase.expectedExtractableClasses.length > 0) {
		// Count expected occurrences of each class
		const expectedCounts = new Map<string, number>();
		testCase.expectedExtractableClasses.forEach(cls => {
			expectedCounts.set(cls, (expectedCounts.get(cls) || 0) + 1);
		});

		// Count actual occurrences
		const actualCounts = new Map<string, number>();
		extractableTexts.forEach(cls => {
			actualCounts.set(cls, (actualCounts.get(cls) || 0) + 1);
		});

		// Verify each expected class appears the correct number of times
		expectedCounts.forEach((expectedCount, cls) => {
			const actualCount = actualCounts.get(cls) || 0;
			expect(actualCount).toBe(expectedCount);
		});

		// Verify no unexpected extractables
		extractableTexts.forEach(text => {
			expect(testCase.expectedExtractableClasses).toContain(text);
		});
	} else if (testCase.expectedDuplicateClasses.length === 0) {
		// No extractables expected and no duplicates expected
		expect(extractableDiagnostics.length).toBe(0);
	}

	// Verify diagnostic format for duplicates
	duplicateDiagnostics.forEach(diagnostic => {
		expect(diagnostic.category).toBe(ts.DiagnosticCategory.Warning);
		expect(typeof diagnostic.messageText).toBe('string');
		if (typeof diagnostic.messageText === 'string') {
			expect(diagnostic.messageText).toContain('Duplicate class');
		}
	});

	// Verify diagnostic format for extractables
	extractableDiagnostics.forEach(diagnostic => {
		expect(diagnostic.category).toBe(ts.DiagnosticCategory.Warning);
		expect(typeof diagnostic.messageText === 'string').toBe(true);
	});
}

/**
 * Generate test assertions for conflicting class detection
 */
export function createConflictTestAssertion(
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

	// Filter to conflict warnings
	const conflictDiagnostics = functionDiagnostics.filter(d => d.code === TAILWIND_CONFLICT_CODE);
	const conflictTexts = conflictDiagnostics.map(d => getTextAtDiagnostic(d, sourceCode));

	// Filter to duplicate warnings (for combined cases)
	const duplicateDiagnostics = functionDiagnostics.filter(d => d.code === TAILWIND_DUPLICATE_CODE);
	const duplicateTexts = duplicateDiagnostics.map(d => getTextAtDiagnostic(d, sourceCode));

	// Filter to invalid class errors (for combined cases)
	const invalidDiagnostics = functionDiagnostics.filter(d => d.code === TAILWIND_DIAGNOSTIC_CODE);
	const invalidTexts = invalidDiagnostics.map(d => getTextAtDiagnostic(d, sourceCode));

	// Check expected conflict classes
	if (testCase.expectedConflictClasses.length > 0) {
		// Count expected occurrences of each class
		const expectedCounts = new Map<string, number>();
		testCase.expectedConflictClasses.forEach(cls => {
			expectedCounts.set(cls, (expectedCounts.get(cls) || 0) + 1);
		});

		// Count actual occurrences
		const actualCounts = new Map<string, number>();
		conflictTexts.forEach(cls => {
			actualCounts.set(cls, (actualCounts.get(cls) || 0) + 1);
		});

		// Verify each expected class appears the correct number of times
		expectedCounts.forEach((expectedCount, cls) => {
			const actualCount = actualCounts.get(cls) || 0;
			expect(actualCount).toBe(expectedCount);
		});

		// Verify no unexpected conflicts
		conflictTexts.forEach(text => {
			expect(testCase.expectedConflictClasses).toContain(text);
		});
	} else if (
		testCase.expectedDuplicateClasses.length === 0 &&
		testCase.expectedInvalidClasses.length === 0
	) {
		// No conflicts expected (valid case) - but only check if no other issues expected
		expect(conflictDiagnostics.length).toBe(0);
	}

	// Check expected duplicate classes (for combined cases)
	if (testCase.expectedDuplicateClasses.length > 0) {
		const expectedDupCounts = new Map<string, number>();
		testCase.expectedDuplicateClasses.forEach(cls => {
			expectedDupCounts.set(cls, (expectedDupCounts.get(cls) || 0) + 1);
		});

		const actualDupCounts = new Map<string, number>();
		duplicateTexts.forEach(cls => {
			actualDupCounts.set(cls, (actualDupCounts.get(cls) || 0) + 1);
		});

		expectedDupCounts.forEach((expectedCount, cls) => {
			const actualCount = actualDupCounts.get(cls) || 0;
			expect(actualCount).toBe(expectedCount);
		});

		duplicateTexts.forEach(text => {
			expect(testCase.expectedDuplicateClasses).toContain(text);
		});
	}

	// Check expected invalid classes (for combined cases)
	if (testCase.expectedInvalidClasses.length > 0) {
		testCase.expectedInvalidClasses.forEach(cls => {
			expect(invalidTexts).toContain(cls);
		});

		invalidTexts.forEach(text => {
			expect(testCase.expectedInvalidClasses).toContain(text);
		});
	}

	// Verify diagnostic format for conflicts
	conflictDiagnostics.forEach(diagnostic => {
		expect(diagnostic.category).toBe(ts.DiagnosticCategory.Warning);
		expect(typeof diagnostic.messageText).toBe('string');
		if (typeof diagnostic.messageText === 'string') {
			expect(diagnostic.messageText).toContain('conflicts');
		}
	});
}
