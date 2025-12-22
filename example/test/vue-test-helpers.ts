/**
 * Test helpers for Vue files
 *
 * Uses @vue/language-core to transform Vue SFCs into TypeScript,
 * then runs our plugin on the generated code.
 */
import * as ts from 'typescript/lib/tsserverlibrary';
import fs from 'fs';
import path from 'path';

import pluginFactory from '../../src/index';

const vue = require('@vue/language-core');

export interface PluginInstance {
	dispose: () => void;
}

export interface SourceMapping {
	sourceOffsets: number[];
	generatedOffsets: number[];
	lengths: number[];
	data: {
		verification?: boolean;
		completion?: boolean;
		semantic?: boolean | Record<string, unknown>;
		navigation?: boolean | Record<string, unknown>;
	};
}

export interface VueRunPluginResult {
	diagnostics: ts.Diagnostic[];
	sourceCode: string;
	generatedCode: string;
	plugin: PluginInstance;
	mappings: SourceMapping[];
}

export const DiagnosticCodes = {
	INVALID_CLASS: 90001,
	DUPLICATE_CLASS: 90002,
	EXTRACTABLE_CLASS: 90003,
	CONFLICT_CLASS: 90004
} as const;

/**
 * Run the plugin on a Vue test folder.
 *
 * The folder should contain:
 * - example.vue: The Vue component to test
 * - tsconfig.json: Plugin configuration
 * - global.css: Tailwind CSS configuration
 */
export async function runVuePlugin(testDir: string): Promise<VueRunPluginResult> {
	const exampleFile = path.join(testDir, 'example.vue');
	const tsconfigFile = path.join(testDir, 'tsconfig.json');
	const globalCssFile = path.join(testDir, 'global.css');

	// Validate required files exist
	if (!fs.existsSync(exampleFile)) {
		throw new Error(`Missing example.vue in ${testDir}`);
	}
	if (!fs.existsSync(tsconfigFile)) {
		throw new Error(`Missing tsconfig.json in ${testDir}`);
	}
	if (!fs.existsSync(globalCssFile)) {
		throw new Error(`Missing global.css in ${testDir}`);
	}

	// Read Vue source code
	const vueSourceCode = fs.readFileSync(exampleFile, 'utf-8');

	// Read tsconfig.json to get plugin configuration
	const tsconfigContent = fs.readFileSync(tsconfigFile, 'utf-8');
	const tsconfig = JSON.parse(tsconfigContent);

	// Extract plugin config
	const pluginConfig = tsconfig.compilerOptions?.plugins?.find(
		(p: { name: string }) => p.name === 'tailwind-typescript-plugin'
	);

	if (!pluginConfig) {
		throw new Error(`Missing tailwind-typescript-plugin in tsconfig.json plugins`);
	}

	// Create Vue compiler options (API changed in v3)
	const vueCompilerOptions = vue.getDefaultCompilerOptions();

	// Create the Vue language plugin
	const languagePlugin = vue.createVueLanguagePlugin(
		ts,
		{}, // compiler options
		vueCompilerOptions,
		(id: string) => id
	);

	// Create a snapshot from the Vue code
	const snapshot = ts.ScriptSnapshot.fromString(vueSourceCode);

	// Create virtual code from Vue SFC
	const virtualCode = languagePlugin.createVirtualCode?.(exampleFile, 'vue', snapshot, undefined);

	if (!virtualCode) {
		throw new Error('Failed to create virtual code from Vue file');
	}

	// Find the generated TypeScript code (script_ts)
	let generatedTsCode = '';
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let scriptEmbeddedCode: any = null;

	for (const code of vue.forEachEmbeddedCode(virtualCode) as Iterable<{
		id: string;
		languageId: string;
		snapshot: ts.IScriptSnapshot;
		mappings?: SourceMapping[];
	}>) {
		if (code.id === 'script_ts' || code.id.startsWith('script_')) {
			if (code.languageId === 'typescript' || code.languageId === 'tsx') {
				generatedTsCode = code.snapshot.getText(0, code.snapshot.getLength());
				scriptEmbeddedCode = code;
				break;
			}
		}
	}

	if (!generatedTsCode || !scriptEmbeddedCode) {
		throw new Error('No TypeScript code generated from Vue file');
	}

	// Extract source mappings for position verification
	const mappings: SourceMapping[] = scriptEmbeddedCode.mappings || [];

	// Create a virtual .vue file name - we'll handle it specially
	// The key insight: we need TypeScript to see this as a valid TS file
	// but we want our plugin to see it as a .vue file for framework detection
	const virtualTsFile = exampleFile + '.ts'; // example.vue.ts

	// Create language service with the generated TypeScript code
	const languageService = ts.createLanguageService(
		{
			getCompilationSettings: () => ({
				target: ts.ScriptTarget.ES2020,
				module: ts.ModuleKind.ESNext,
				moduleResolution: ts.ModuleResolutionKind.Bundler,
				jsx: ts.JsxEmit.Preserve,
				strict: true
			}),
			getScriptFileNames: () => [virtualTsFile],
			getScriptVersion: () => '0',
			getScriptSnapshot: (fileName: string) => {
				if (fileName === virtualTsFile) {
					return ts.ScriptSnapshot.fromString(generatedTsCode);
				}
				if (fs.existsSync(fileName)) {
					return ts.ScriptSnapshot.fromString(fs.readFileSync(fileName, 'utf-8'));
				}
				return undefined;
			},
			getCurrentDirectory: () => testDir,
			getDefaultLibFileName: (options: ts.CompilerOptions) => ts.getDefaultLibFilePath(options),
			fileExists: (fileName: string) => {
				if (fileName === virtualTsFile) return true;
				return ts.sys.fileExists(fileName);
			},
			readFile: (fileName: string) => {
				if (fileName === virtualTsFile) return generatedTsCode;
				return ts.sys.readFile(fileName);
			},
			readDirectory: ts.sys.readDirectory
		} as ts.LanguageServiceHost,
		ts.createDocumentRegistry()
	);

	// Create mock plugin info
	const mockInfo = {
		languageService,
		languageServiceHost: languageService as unknown as ts.LanguageServiceHost,
		project: {
			getCurrentDirectory: () => testDir,
			projectService: {
				logger: {
					info: () => {
						// Silent logger for tests
					}
				}
			}
		} as unknown as ts.server.Project,
		config: {
			...pluginConfig,
			globalCss: globalCssFile
		},
		serverHost: {} as unknown as ts.server.ServerHost
	};

	// Initialize plugin
	const plugin = pluginFactory({ typescript: ts });
	const proxy = plugin.create(mockInfo);

	// Wait for validator to initialize
	await plugin.getInitializationPromise();

	// Get diagnostics
	const diagnostics = proxy.getSemanticDiagnostics(virtualTsFile);

	return {
		diagnostics,
		sourceCode: vueSourceCode,
		generatedCode: generatedTsCode,
		plugin,
		mappings
	};
}

/**
 * Get the text at a diagnostic location
 */
export function getTextAtDiagnostic(diagnostic: ts.Diagnostic, sourceCode: string): string {
	if (diagnostic.start === undefined || diagnostic.length === undefined) {
		return '';
	}
	return sourceCode.substring(diagnostic.start, diagnostic.start + diagnostic.length);
}

/**
 * Filter diagnostics by code
 */
export function filterDiagnostics(diagnostics: ts.Diagnostic[], code: number): ts.Diagnostic[] {
	return diagnostics.filter(d => d.code === code);
}

/**
 * Get invalid class diagnostics
 */
export function getInvalidClassDiagnostics(diagnostics: ts.Diagnostic[]): ts.Diagnostic[] {
	return filterDiagnostics(diagnostics, DiagnosticCodes.INVALID_CLASS);
}

/**
 * Get duplicate class diagnostics
 */
export function getDuplicateClassDiagnostics(diagnostics: ts.Diagnostic[]): ts.Diagnostic[] {
	return filterDiagnostics(diagnostics, DiagnosticCodes.DUPLICATE_CLASS);
}

/**
 * Get conflict class diagnostics
 */
export function getConflictClassDiagnostics(diagnostics: ts.Diagnostic[]): ts.Diagnostic[] {
	return filterDiagnostics(diagnostics, DiagnosticCodes.CONFLICT_CLASS);
}

/**
 * Extract class names from diagnostics (using position text)
 */
export function getClassNamesFromDiagnostics(
	diagnostics: ts.Diagnostic[],
	sourceCode: string
): string[] {
	return diagnostics.map(d => getTextAtDiagnostic(d, sourceCode));
}

/**
 * Extract class names from diagnostic messages.
 * Parses messages like: 'The class "invalid-class" is not a valid Tailwind class'
 * This is useful for resolved references where the position points to the
 * variable/expression in the template, not the actual class string.
 */
export function getClassNamesFromDiagnosticMessages(diagnostics: ts.Diagnostic[]): string[] {
	const classNames: string[] = [];
	const classPattern = /The class "([^"]+)"/;

	for (const diagnostic of diagnostics) {
		const message =
			typeof diagnostic.messageText === 'string'
				? diagnostic.messageText
				: diagnostic.messageText.messageText;
		const match = classPattern.exec(message);
		if (match) {
			classNames.push(match[1]);
		}
	}

	return classNames;
}

/**
 * Map a position from generated TypeScript to Vue source.
 * Returns null if no mapping is found or if the mapping doesn't have semantic data.
 */
export function mapGeneratedToVuePosition(
	generatedPosition: number,
	mappings: SourceMapping[]
): { vuePosition: number; hasSemantic: boolean } | null {
	for (const mapping of mappings) {
		const genStart = mapping.generatedOffsets[0];
		const genEnd = genStart + mapping.lengths[0];

		if (generatedPosition >= genStart && generatedPosition < genEnd) {
			const offset = generatedPosition - genStart;
			const vuePosition = mapping.sourceOffsets[0] + offset;
			const hasSemantic = mapping.data.semantic === true;
			return { vuePosition, hasSemantic };
		}
	}
	return null;
}

/**
 * Get line and column from a position in source code.
 * Returns 1-based line and column numbers.
 */
export function getLineAndColumn(
	position: number,
	sourceCode: string
): { line: number; column: number } {
	const textBefore = sourceCode.substring(0, position);
	const lines = textBefore.split('\n');
	return {
		line: lines.length,
		column: lines[lines.length - 1].length + 1
	};
}
