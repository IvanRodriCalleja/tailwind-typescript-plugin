/**
 * Plugin Bridge: Wraps the real TypeScript plugin, following the exact pattern
 * from example/test/folder-test-helpers.ts and vue-test-helpers.ts.
 *
 * Each session uses the exact config from that test case's tsconfig.json.
 */
import * as ts from 'typescript/lib/tsserverlibrary';
import fs from 'fs';
import { createRequire } from 'module';
import path from 'path';

import { type TestCaseExpectations, parseExpectations } from './jsdoc-parser';

const require = createRequire(import.meta.url);
const pluginFactory = require('../../../lib/index');

let vue: typeof import('@vue/language-core') | undefined;
try {
	vue = require('@vue/language-core');
} catch {
	// Vue support optional
}

let astroCompiler: typeof import('@astrojs/compiler') | undefined;
try {
	astroCompiler = require('@astrojs/compiler');
} catch {
	// Astro support optional
}

let traceMapping: typeof import('@jridgewell/trace-mapping') | undefined;
try {
	traceMapping = require('@jridgewell/trace-mapping');
} catch {
	// trace-mapping optional (needed for Astro)
}

export interface DiagnosticResult {
	message: string;
	start: number;
	length: number;
	line: number;
	column: number;
	endLine: number;
	endColumn: number;
	code: number;
	category: 'error' | 'warning' | 'suggestion' | 'message';
	source?: string;
	className?: string;
}

export interface CompletionResult {
	name: string;
	kind: string;
	sortText?: string;
}

export interface CodeActionResult {
	description: string;
	changes: Array<{
		fileName: string;
		textChanges: Array<{
			span: { start: number; length: number };
			newText: string;
		}>;
	}>;
}

export interface TestCaseInfo {
	code: string;
	language: 'typescriptreact' | 'vue' | 'astro';
	config: Record<string, unknown>;
	tsconfig: Record<string, unknown>;
	filePath: string;
	framework: string;
	category: string;
	name: string;
	expectations: TestCaseExpectations;
}

export interface TestCaseEntry {
	framework: string;
	category: string;
	name: string;
	path: string;
}

interface SourceMapping {
	sourceOffsets: number[];
	generatedOffsets: number[];
	lengths: number[];
	generatedLengths?: number[];
}

interface AstroSourceMap {
	decodedMap: unknown; // TraceMap instance
	generatedCode: string;
}

interface PluginSession {
	proxy: ts.LanguageService;
	plugin: { dispose: () => void };
	filePath: string;
	virtualFilePath?: string;
	sourceCode: string;
	generatedCode?: string;
	sourceMappings?: SourceMapping[];
	astroSourceMap?: AstroSourceMap;
	version: number;
}

export class PluginBridge {
	private sessions = new Map<string, PluginSession>();
	private sessionOrder: string[] = [];
	private readonly maxSessions = 10;
	private exampleDir: string;

	constructor(exampleDir: string) {
		this.exampleDir = exampleDir;
	}

	/**
	 * Evict oldest sessions to stay under maxSessions limit.
	 */
	private evictOldSessions(): void {
		while (this.sessionOrder.length > this.maxSessions) {
			const oldest = this.sessionOrder.shift()!;
			const session = this.sessions.get(oldest);
			if (session) {
				try {
					session.plugin.dispose();
				} catch {}
				this.sessions.delete(oldest);
			}
		}
	}

	/**
	 * List all test cases from the example directory.
	 */
	listTestCases(): TestCaseEntry[] {
		const entries: TestCaseEntry[] = [];

		for (const framework of ['jsx', 'vue', 'astro']) {
			const frameworkDir = path.join(this.exampleDir, 'src', framework);
			if (!fs.existsSync(frameworkDir)) continue;

			const categories = fs
				.readdirSync(frameworkDir, { withFileTypes: true })
				.filter(d => d.isDirectory())
				.map(d => d.name);

			for (const category of categories) {
				const categoryDir = path.join(frameworkDir, category);
				const testCases = fs
					.readdirSync(categoryDir, { withFileTypes: true })
					.filter(d => d.isDirectory())
					.map(d => d.name);

				for (const name of testCases) {
					entries.push({
						framework,
						category,
						name,
						path: path.join(categoryDir, name)
					});
				}
			}
		}

		return entries;
	}

	/**
	 * Get test case info (code, language, config, expectations).
	 */
	getTestCaseInfo(framework: string, category: string, name: string): TestCaseInfo {
		const testDir = path.join(this.exampleDir, 'src', framework, category, name);

		if (!fs.existsSync(testDir)) {
			throw new Error(`Test case directory not found: ${testDir}`);
		}

		const ext = framework === 'vue' ? '.vue' : framework === 'astro' ? '.astro' : '.tsx';
		const exampleFile = path.join(testDir, `example${ext}`);

		if (!fs.existsSync(exampleFile)) {
			throw new Error(`Example file not found: ${exampleFile}`);
		}

		const code = fs.readFileSync(exampleFile, 'utf-8');
		const tsconfigPath = path.join(testDir, 'tsconfig.json');
		const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));
		const pluginConfig =
			tsconfig.compilerOptions?.plugins?.find(
				(p: { name: string }) => p.name === 'tailwind-typescript-plugin'
			) || {};

		const expectations = parseExpectations(code);

		const language = framework === 'vue' ? 'vue' : framework === 'astro' ? 'astro' : 'typescriptreact';

		return {
			code,
			language: language as 'typescriptreact' | 'vue' | 'astro',
			config: pluginConfig,
			tsconfig,
			filePath: exampleFile,
			framework,
			category,
			name,
			expectations
		};
	}

	/**
	 * Get or create a plugin session for a test case.
	 */
	private async getSession(testCasePath: string): Promise<PluginSession> {
		const cached = this.sessions.get(testCasePath);
		if (cached) {
			// Move to end of LRU order
			const idx = this.sessionOrder.indexOf(testCasePath);
			if (idx !== -1) this.sessionOrder.splice(idx, 1);
			this.sessionOrder.push(testCasePath);
			return cached;
		}

		// Evict old sessions before creating new one
		this.evictOldSessions();

		const testDir = testCasePath;

		// Find example file
		const isVue = fs.existsSync(path.join(testDir, 'example.vue'));
		const isAstro = fs.existsSync(path.join(testDir, 'example.astro'));
		const ext = isVue ? '.vue' : isAstro ? '.astro' : '.tsx';
		const exampleFile = path.join(testDir, `example${ext}`);
		const tsconfigFile = path.join(testDir, 'tsconfig.json');
		const globalCssFile = path.join(testDir, 'global.css');

		if (!fs.existsSync(exampleFile)) {
			throw new Error(`Missing example file in ${testDir}`);
		}
		if (!fs.existsSync(tsconfigFile)) {
			throw new Error(`Missing tsconfig.json in ${testDir}`);
		}
		if (!fs.existsSync(globalCssFile)) {
			throw new Error(`Missing global.css in ${testDir}`);
		}

		const tsconfigContent = JSON.parse(fs.readFileSync(tsconfigFile, 'utf-8'));
		const pluginConfig = tsconfigContent.compilerOptions?.plugins?.find(
			(p: { name: string }) => p.name === 'tailwind-typescript-plugin'
		);

		if (!pluginConfig) {
			throw new Error(`Missing tailwind-typescript-plugin in tsconfig.json plugins`);
		}

		const sourceCode = fs.readFileSync(exampleFile, 'utf-8');

		let session: PluginSession;

		if (isVue && vue) {
			session = await this.createVueSession(
				testDir,
				exampleFile,
				sourceCode,
				pluginConfig,
				globalCssFile
			);
		} else if (isAstro && astroCompiler) {
			session = await this.createAstroSession(
				testDir,
				exampleFile,
				sourceCode,
				pluginConfig,
				globalCssFile
			);
		} else {
			session = await this.createJsxSession(
				testDir,
				exampleFile,
				sourceCode,
				pluginConfig,
				globalCssFile,
				tsconfigFile
			);
		}

		this.sessions.set(testCasePath, session);
		this.sessionOrder.push(testCasePath);
		return session;
	}

	private async createJsxSession(
		testDir: string,
		exampleFile: string,
		sourceCode: string,
		pluginConfig: Record<string, unknown>,
		globalCssFile: string,
		tsconfigFile: string
	): Promise<PluginSession> {
		const configFile = ts.readConfigFile(tsconfigFile, ts.sys.readFile);
		const parsedConfig = ts.parseJsonConfigFileContent(configFile.config, ts.sys, testDir);

		const currentSource = sourceCode;
		const version = 0;

		const languageService = ts.createLanguageService(
			{
				getCompilationSettings: () => parsedConfig.options,
				getScriptFileNames: () => [exampleFile],
				getScriptVersion: () => String(version),
				getScriptSnapshot: (fileName: string) => {
					if (fileName === exampleFile) {
						return ts.ScriptSnapshot.fromString(currentSource);
					}
					if (fs.existsSync(fileName)) {
						return ts.ScriptSnapshot.fromString(fs.readFileSync(fileName, 'utf-8'));
					}
					return undefined;
				},
				getCurrentDirectory: () => testDir,
				getDefaultLibFileName: (options: ts.CompilerOptions) => ts.getDefaultLibFilePath(options),
				fileExists: ts.sys.fileExists,
				readFile: ts.sys.readFile,
				readDirectory: ts.sys.readDirectory
			} as ts.LanguageServiceHost,
			ts.createDocumentRegistry()
		);

		const mockInfo = {
			languageService,
			languageServiceHost: languageService as unknown as ts.LanguageServiceHost,
			project: {
				getCurrentDirectory: () => testDir,
				projectService: {
					logger: { info: () => {} }
				}
			} as unknown as ts.server.Project,
			config: {
				...pluginConfig,
				globalCss: globalCssFile
			},
			serverHost: {} as unknown as ts.server.ServerHost
		};

		const plugin = pluginFactory({ typescript: ts });
		const proxy = plugin.create(mockInfo);
		await plugin.getInitializationPromise();

		return {
			proxy,
			plugin,
			filePath: exampleFile,
			sourceCode: currentSource,
			version
		};
	}

	private async createVueSession(
		testDir: string,
		exampleFile: string,
		sourceCode: string,
		pluginConfig: Record<string, unknown>,
		globalCssFile: string
	): Promise<PluginSession> {
		if (!vue) {
			throw new Error('@vue/language-core is not installed');
		}

		const vueCompilerOptions = vue.getDefaultCompilerOptions();
		const languagePlugin = vue.createVueLanguagePlugin(
			ts,
			{},
			vueCompilerOptions,
			(id: string) => id
		);

		const snapshot = ts.ScriptSnapshot.fromString(sourceCode);
		const virtualCode = languagePlugin.createVirtualCode?.(exampleFile, 'vue', snapshot, undefined);

		if (!virtualCode) {
			throw new Error('Failed to create virtual code from Vue file');
		}

		let generatedTsCode = '';
		let sourceMappings: SourceMapping[] = [];
		for (const code of vue.forEachEmbeddedCode(virtualCode) as Iterable<{
			id: string;
			languageId: string;
			snapshot: ts.IScriptSnapshot;
			mappings: SourceMapping[];
		}>) {
			if (
				(code.id === 'script_ts' || code.id.startsWith('script_')) &&
				(code.languageId === 'typescript' || code.languageId === 'tsx')
			) {
				generatedTsCode = code.snapshot.getText(0, code.snapshot.getLength());
				sourceMappings = code.mappings;
				break;
			}
		}

		if (!generatedTsCode) {
			throw new Error('No TypeScript code generated from Vue file');
		}

		const virtualTsFile = exampleFile + '.ts';
		const currentGenerated = generatedTsCode;
		const version = 0;

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
				getScriptVersion: () => String(version),
				getScriptSnapshot: (fileName: string) => {
					if (fileName === virtualTsFile) {
						return ts.ScriptSnapshot.fromString(currentGenerated);
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
					if (fileName === virtualTsFile) return currentGenerated;
					return ts.sys.readFile(fileName);
				},
				readDirectory: ts.sys.readDirectory
			} as ts.LanguageServiceHost,
			ts.createDocumentRegistry()
		);

		const mockInfo = {
			languageService,
			languageServiceHost: languageService as unknown as ts.LanguageServiceHost,
			project: {
				getCurrentDirectory: () => testDir,
				projectService: {
					logger: { info: () => {} }
				}
			} as unknown as ts.server.Project,
			config: {
				...pluginConfig,
				globalCss: globalCssFile
			},
			serverHost: {} as unknown as ts.server.ServerHost
		};

		const plugin = pluginFactory({ typescript: ts });
		const proxy = plugin.create(mockInfo);
		await plugin.getInitializationPromise();

		return {
			proxy,
			plugin,
			filePath: exampleFile,
			virtualFilePath: virtualTsFile,
			sourceCode,
			generatedCode: generatedTsCode,
			sourceMappings,
			version
		};
	}

	private async createAstroSession(
		testDir: string,
		exampleFile: string,
		sourceCode: string,
		pluginConfig: Record<string, unknown>,
		globalCssFile: string
	): Promise<PluginSession> {
		if (!astroCompiler) {
			throw new Error('@astrojs/compiler is not installed');
		}
		if (!traceMapping) {
			throw new Error('@jridgewell/trace-mapping is not installed');
		}

		const result = await astroCompiler.convertToTSX(sourceCode, {
			filename: exampleFile
		});

		const generatedTsx = result.code;
		const virtualTsxFile = exampleFile + '.tsx';

		// Decode the sourcemap for position mapping
		let decodedMap: unknown = undefined;
		if (result.map) {
			const mapData = typeof result.map === 'string' ? JSON.parse(result.map) : result.map;
			decodedMap = new traceMapping.TraceMap(mapData);
		}

		const currentGenerated = generatedTsx;
		const version = 0;

		const languageService = ts.createLanguageService(
			{
				getCompilationSettings: () => ({
					target: ts.ScriptTarget.ES2020,
					module: ts.ModuleKind.ESNext,
					moduleResolution: ts.ModuleResolutionKind.Bundler,
					jsx: ts.JsxEmit.Preserve,
					strict: true
				}),
				getScriptFileNames: () => [virtualTsxFile],
				getScriptVersion: () => String(version),
				getScriptSnapshot: (fileName: string) => {
					if (fileName === virtualTsxFile) {
						return ts.ScriptSnapshot.fromString(currentGenerated);
					}
					if (fs.existsSync(fileName)) {
						return ts.ScriptSnapshot.fromString(fs.readFileSync(fileName, 'utf-8'));
					}
					return undefined;
				},
				getCurrentDirectory: () => testDir,
				getDefaultLibFileName: (options: ts.CompilerOptions) => ts.getDefaultLibFilePath(options),
				fileExists: (fileName: string) => {
					if (fileName === virtualTsxFile) return true;
					return ts.sys.fileExists(fileName);
				},
				readFile: (fileName: string) => {
					if (fileName === virtualTsxFile) return currentGenerated;
					return ts.sys.readFile(fileName);
				},
				readDirectory: ts.sys.readDirectory
			} as ts.LanguageServiceHost,
			ts.createDocumentRegistry()
		);

		const mockInfo = {
			languageService,
			languageServiceHost: languageService as unknown as ts.LanguageServiceHost,
			project: {
				getCurrentDirectory: () => testDir,
				projectService: {
					logger: { info: () => {} }
				}
			} as unknown as ts.server.Project,
			config: {
				...pluginConfig,
				globalCss: globalCssFile
			},
			serverHost: {} as unknown as ts.server.ServerHost
		};

		const plugin = pluginFactory({ typescript: ts });
		const proxy = plugin.create(mockInfo);
		await plugin.getInitializationPromise();

		return {
			proxy,
			plugin,
			filePath: exampleFile,
			virtualFilePath: virtualTsxFile,
			sourceCode,
			generatedCode: generatedTsx,
			astroSourceMap: decodedMap ? { decodedMap, generatedCode: generatedTsx } : undefined,
			version
		};
	}

	/**
	 * Get diagnostics for a test case.
	 */
	async getDiagnostics(testCasePath: string): Promise<DiagnosticResult[]> {
		const session = await this.getSession(testCasePath);
		const targetFile = session.virtualFilePath || session.filePath;
		const allDiagnostics = session.proxy.getSemanticDiagnostics(targetFile);
		const generatedCode = session.generatedCode || session.sourceCode;

		// Only return plugin diagnostics (source: 'tw-plugin').
		// The proxy also includes TypeScript's own diagnostics (e.g. "Cannot find
		// module 'vue'") which are environment-dependent and not what we're testing.
		const diagnostics = allDiagnostics.filter(
			d => (d as { source?: string }).source === 'tw-plugin'
		);

		return diagnostics.map(d => {
			const genStart = d.start ?? 0;
			const genLength = d.length ?? 0;

			// For Vue files, map positions from generated TypeScript back to original .vue source
			if (session.sourceMappings && session.generatedCode) {
				const mappedStart = mapGeneratedToSource(genStart, session.sourceMappings);
				const mappedEnd = mapGeneratedToSource(genStart + genLength, session.sourceMappings);

				if (mappedStart !== null && mappedEnd !== null) {
					const { line, column } = getLineAndColumn(mappedStart, session.sourceCode);
					const { line: endLine, column: endColumn } = getLineAndColumn(mappedEnd, session.sourceCode);
					const className = session.sourceCode.substring(mappedStart, mappedEnd);

					return {
						message: typeof d.messageText === 'string' ? d.messageText : d.messageText.messageText,
						start: mappedStart,
						length: mappedEnd - mappedStart,
						line,
						column,
						endLine,
						endColumn,
						code: d.code,
						category: categoryToString(d.category),
						source: (d as { source?: string }).source,
						className
					};
				}
			}

			// For Astro files, map positions from generated TSX back to original .astro source
			if (session.astroSourceMap && traceMapping) {
				const genCode = session.astroSourceMap.generatedCode;
				const genPos = getLineAndColumn(genStart, genCode);
				const genEndPos = getLineAndColumn(genStart + genLength, genCode);

				const mapped = traceMapping.originalPositionFor(
					session.astroSourceMap.decodedMap as import('@jridgewell/trace-mapping').TraceMap,
					{ line: genPos.line, column: genPos.column - 1 }
				);
				const mappedEnd = traceMapping.originalPositionFor(
					session.astroSourceMap.decodedMap as import('@jridgewell/trace-mapping').TraceMap,
					{ line: genEndPos.line, column: genEndPos.column - 1 }
				);

				if (mapped.line !== null && mapped.column !== null && mappedEnd.line !== null && mappedEnd.column !== null) {
					const srcStart = offsetFromLineColumn(mapped.line, mapped.column, session.sourceCode);
					const srcEnd = offsetFromLineColumn(mappedEnd.line, mappedEnd.column, session.sourceCode);

					if (srcStart !== null && srcEnd !== null) {
						const className = session.sourceCode.substring(srcStart, srcEnd);

						return {
							message: typeof d.messageText === 'string' ? d.messageText : d.messageText.messageText,
							start: srcStart,
							length: srcEnd - srcStart,
							line: mapped.line,
							column: mapped.column + 1,
							endLine: mappedEnd.line,
							endColumn: mappedEnd.column + 1,
							code: d.code,
							category: categoryToString(d.category),
							source: (d as { source?: string }).source,
							className
						};
					}
				}
			}

			// JSX files or unmapped positions: use generated code directly
			const { line, column } = getLineAndColumn(genStart, generatedCode);
			const { line: endLine, column: endColumn } = getLineAndColumn(genStart + genLength, generatedCode);
			const className = generatedCode.substring(genStart, genStart + genLength);

			return {
				message: typeof d.messageText === 'string' ? d.messageText : d.messageText.messageText,
				start: genStart,
				length: genLength,
				line,
				column,
				endLine,
				endColumn,
				code: d.code,
				category: categoryToString(d.category),
				source: (d as { source?: string }).source,
				className
			};
		});
	}

	/**
	 * Get completions for a test case at a position.
	 */
	async getCompletions(testCasePath: string, position: number): Promise<CompletionResult[]> {
		const session = await this.getSession(testCasePath);
		const targetFile = session.virtualFilePath || session.filePath;
		const completions = session.proxy.getCompletionsAtPosition(targetFile, position, undefined);

		if (!completions) return [];

		return completions.entries.map(e => ({
			name: e.name,
			kind: e.kind,
			sortText: e.sortText
		}));
	}

	/**
	 * Get code actions (code fixes) for a test case.
	 */
	async getCodeActions(
		testCasePath: string,
		start: number,
		end: number,
		errorCodes: number[]
	): Promise<CodeActionResult[]> {
		const session = await this.getSession(testCasePath);
		const targetFile = session.virtualFilePath || session.filePath;
		const fixes = session.proxy.getCodeFixesAtPosition(
			targetFile,
			start,
			end,
			errorCodes,
			{} as ts.FormatCodeSettings,
			{}
		);

		return fixes.map(fix => ({
			description: fix.description,
			changes: fix.changes.map(change => ({
				fileName: change.fileName,
				textChanges: change.textChanges.map(tc => ({
					span: { start: tc.span.start, length: tc.span.length },
					newText: tc.newText
				}))
			}))
		}));
	}

	/**
	 * Run diagnostics on custom code (not from example directory).
	 */
	async getDiagnosticsForCustomCode(
		code: string,
		language: 'tsx' | 'vue',
		config: Record<string, unknown>
	): Promise<DiagnosticResult[]> {
		const tmpDir = path.join(
			this.exampleDir,
			'src',
			'jsx',
			'literal-static',
			'error-01-single-invalid'
		);
		const globalCssFile = path.join(tmpDir, 'global.css');

		const fileName = language === 'vue' ? '/tmp/custom.vue.ts' : '/tmp/custom.tsx';
		const version = 0;
		const currentCode = code;

		const compilerOptions: ts.CompilerOptions = {
			target: ts.ScriptTarget.ES2020,
			module: ts.ModuleKind.ESNext,
			moduleResolution: ts.ModuleResolutionKind.Bundler,
			jsx: ts.JsxEmit.ReactJSX,
			strict: true
		};

		const languageService = ts.createLanguageService(
			{
				getCompilationSettings: () => compilerOptions,
				getScriptFileNames: () => [fileName],
				getScriptVersion: () => String(version),
				getScriptSnapshot: (fn: string) => {
					if (fn === fileName) {
						return ts.ScriptSnapshot.fromString(currentCode);
					}
					if (fs.existsSync(fn)) {
						return ts.ScriptSnapshot.fromString(fs.readFileSync(fn, 'utf-8'));
					}
					return undefined;
				},
				getCurrentDirectory: () => tmpDir,
				getDefaultLibFileName: (opts: ts.CompilerOptions) => ts.getDefaultLibFilePath(opts),
				fileExists: (fn: string) => {
					if (fn === fileName) return true;
					return ts.sys.fileExists(fn);
				},
				readFile: (fn: string) => {
					if (fn === fileName) return currentCode;
					return ts.sys.readFile(fn);
				},
				readDirectory: ts.sys.readDirectory
			} as ts.LanguageServiceHost,
			ts.createDocumentRegistry()
		);

		const mockInfo = {
			languageService,
			languageServiceHost: languageService as unknown as ts.LanguageServiceHost,
			project: {
				getCurrentDirectory: () => tmpDir,
				projectService: {
					logger: { info: () => {} }
				}
			} as unknown as ts.server.Project,
			config: {
				...config,
				globalCss: globalCssFile
			},
			serverHost: {} as unknown as ts.server.ServerHost
		};

		const plugin = pluginFactory({ typescript: ts });
		const proxy = plugin.create(mockInfo);
		await plugin.getInitializationPromise();

		const allDiagnostics = proxy.getSemanticDiagnostics(fileName);

		plugin.dispose();

		// Only return plugin diagnostics (source: 'tw-plugin')
		const diagnostics = allDiagnostics.filter(
			(d: ts.Diagnostic) => (d as { source?: string }).source === 'tw-plugin'
		);

		return diagnostics.map((d: ts.Diagnostic) => {
			const start = d.start ?? 0;
			const length = d.length ?? 0;
			const { line, column } = getLineAndColumn(start, currentCode);
			const { line: endLine, column: endColumn } = getLineAndColumn(start + length, currentCode);
			const className = currentCode.substring(start, start + length);

			return {
				message: typeof d.messageText === 'string' ? d.messageText : d.messageText.messageText,
				start,
				length,
				line,
				column,
				endLine,
				endColumn,
				code: d.code,
				category: categoryToString(d.category),
				source: (d as { source?: string }).source,
				className
			};
		});
	}

	/**
	 * Dispose all cached sessions.
	 */
	dispose(): void {
		for (const session of this.sessions.values()) {
			session.plugin.dispose();
		}
		this.sessions.clear();
	}
}

/**
 * Map an offset in generated TypeScript code back to the original Vue source.
 * Returns null if the offset is in boilerplate (not mapped to source).
 */
function mapGeneratedToSource(
	generatedOffset: number,
	mappings: SourceMapping[]
): number | null {
	for (const mapping of mappings) {
		for (let i = 0; i < mapping.generatedOffsets.length; i++) {
			const genStart = mapping.generatedOffsets[i];
			const genLen = mapping.generatedLengths?.[i] ?? mapping.lengths[i];
			if (generatedOffset >= genStart && generatedOffset <= genStart + genLen) {
				const srcStart = mapping.sourceOffsets[i];
				const srcLen = mapping.lengths[i];
				const delta = generatedOffset - genStart;
				// Clamp to source range to avoid overshooting
				return srcStart + Math.min(delta, srcLen);
			}
		}
	}
	return null;
}

function getLineAndColumn(position: number, sourceCode: string): { line: number; column: number } {
	const lines = sourceCode.substring(0, position).split('\n');
	return {
		line: lines.length,
		column: lines[lines.length - 1].length + 1
	};
}

/**
 * Convert 1-based line and 0-based column to a character offset in source code.
 */
function offsetFromLineColumn(line: number, column: number, sourceCode: string): number | null {
	const lines = sourceCode.split('\n');
	if (line < 1 || line > lines.length) return null;
	let offset = 0;
	for (let i = 0; i < line - 1; i++) {
		offset += lines[i].length + 1; // +1 for newline
	}
	return offset + column;
}

function categoryToString(
	category: ts.DiagnosticCategory
): 'error' | 'warning' | 'suggestion' | 'message' {
	switch (category) {
		case 1:
			return 'error';
		case 0:
			return 'warning';
		case 2:
			return 'suggestion';
		default:
			return 'message';
	}
}
