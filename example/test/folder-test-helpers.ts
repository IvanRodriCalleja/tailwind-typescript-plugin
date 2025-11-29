import * as ts from 'typescript/lib/tsserverlibrary';
import fs from 'fs';
import path from 'path';

import pluginFactory from '../../src/index';

/**
 * Plugin instance interface for cleanup
 */
export interface PluginInstance {
	dispose: () => void;
}

/**
 * Result from running the plugin on a test folder
 */
export interface RunPluginResult {
	diagnostics: ts.Diagnostic[];
	sourceCode: string;
	plugin: PluginInstance;
}

/**
 * Diagnostic codes from DiagnosticService
 */
export const DiagnosticCodes = {
	INVALID_CLASS: 90001,
	DUPLICATE_CLASS: 90002,
	EXTRACTABLE_CLASS: 90003,
	CONFLICT_CLASS: 90004
} as const;

/**
 * Run the plugin on a test folder.
 *
 * The folder should contain:
 * - example.tsx: The component to test
 * - tsconfig.json: Plugin configuration
 * - global.css: Tailwind CSS configuration
 *
 * @param testDir - The directory containing the test files (use __dirname)
 */
export async function runPlugin(testDir: string): Promise<RunPluginResult> {
	const exampleFile = path.join(testDir, 'example.tsx');
	const tsconfigFile = path.join(testDir, 'tsconfig.json');
	const globalCssFile = path.join(testDir, 'global.css');

	// Validate required files exist
	if (!fs.existsSync(exampleFile)) {
		throw new Error(`Missing example.tsx in ${testDir}`);
	}
	if (!fs.existsSync(tsconfigFile)) {
		throw new Error(`Missing tsconfig.json in ${testDir}`);
	}
	if (!fs.existsSync(globalCssFile)) {
		throw new Error(`Missing global.css in ${testDir}`);
	}

	// Read tsconfig.json to get plugin configuration
	const tsconfigContent = fs.readFileSync(tsconfigFile, 'utf-8');
	const tsconfig = JSON.parse(tsconfigContent);

	// Extract plugin config from compilerOptions.plugins
	const pluginConfig = tsconfig.compilerOptions?.plugins?.find(
		(p: { name: string }) => p.name === 'tailwind-typescript-plugin'
	);

	if (!pluginConfig) {
		throw new Error(`Missing tailwind-typescript-plugin in tsconfig.json plugins`);
	}

	// Parse TypeScript config
	const configFile = ts.readConfigFile(tsconfigFile, ts.sys.readFile);
	const parsedConfig = ts.parseJsonConfigFileContent(configFile.config, ts.sys, testDir);

	// Create language service
	const languageService = ts.createLanguageService(
		{
			getCompilationSettings: () => parsedConfig.options,
			getScriptFileNames: () => [exampleFile],
			getScriptVersion: () => '0',
			getScriptSnapshot: (fileName: string) => {
				if (!fs.existsSync(fileName)) {
					return undefined;
				}
				return ts.ScriptSnapshot.fromString(fs.readFileSync(fileName, 'utf-8'));
			},
			getCurrentDirectory: () => testDir,
			getDefaultLibFileName: (options: ts.CompilerOptions) => ts.getDefaultLibFilePath(options),
			fileExists: ts.sys.fileExists,
			readFile: ts.sys.readFile,
			readDirectory: ts.sys.readDirectory
		} as ts.LanguageServiceHost,
		ts.createDocumentRegistry()
	);

	// Create mock plugin info with config from tsconfig.json
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
			globalCss: globalCssFile // Override to use absolute path
		},
		serverHost: {} as unknown as ts.server.ServerHost
	};

	// Initialize plugin
	const plugin = pluginFactory({ typescript: ts });
	const proxy = plugin.create(mockInfo);

	// Wait for validator to initialize
	await plugin.getInitializationPromise();

	// Get diagnostics
	const diagnostics = proxy.getSemanticDiagnostics(exampleFile);
	const sourceCode = fs.readFileSync(exampleFile, 'utf-8');

	return { diagnostics, sourceCode, plugin };
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
export function filterDiagnostics(
	diagnostics: ts.Diagnostic[],
	code: number
): ts.Diagnostic[] {
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
 * Get extractable class diagnostics (hints)
 */
export function getExtractableClassDiagnostics(diagnostics: ts.Diagnostic[]): ts.Diagnostic[] {
	return filterDiagnostics(diagnostics, DiagnosticCodes.EXTRACTABLE_CLASS);
}

/**
 * Extract class names from diagnostics
 */
export function getClassNamesFromDiagnostics(
	diagnostics: ts.Diagnostic[],
	sourceCode: string
): string[] {
	return diagnostics.map(d => getTextAtDiagnostic(d, sourceCode));
}
