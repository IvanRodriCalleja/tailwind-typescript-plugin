/**
 * Profile the plugin to identify performance bottlenecks
 */
import * as ts from 'typescript/lib/tsserverlibrary';
import fs from 'fs';
import os from 'os';
import path from 'path';

import pluginFactory from '../src/index';

async function profilePlugin() {
	console.log('Profiling Plugin Performance Bottlenecks');
	console.log('='.repeat(80));
	console.log();

	const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'profile-'));
	const testFile = path.join(__dirname, 'test-files', 'AllUseCases.tsx');
	const cssFile = path.join(tempDir, 'global.css');

	fs.writeFileSync(cssFile, '@import "tailwindcss";');

	// Create TypeScript setup
	const tsconfig = path.join(tempDir, 'tsconfig.json');
	fs.writeFileSync(
		tsconfig,
		JSON.stringify({
			compilerOptions: { jsx: 'react', target: 'es2015', module: 'commonjs' }
		})
	);

	const configPath = ts.findConfigFile(tempDir, ts.sys.fileExists, 'tsconfig.json');
	const configFile = ts.readConfigFile(configPath!, ts.sys.readFile);
	const parsedConfig = ts.parseJsonConfigFileContent(configFile.config, ts.sys, tempDir);

	const languageService = ts.createLanguageService(
		{
			getCompilationSettings: () => parsedConfig.options,
			getScriptFileNames: () => [testFile],
			getScriptVersion: () => '0',
			getScriptSnapshot: (fileName: string) => {
				if (!fs.existsSync(fileName)) return undefined;
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

	const mockInfo = {
		languageService,
		languageServiceHost: languageService as unknown as ts.LanguageServiceHost,
		project: {
			getCurrentDirectory: () => tempDir,
			projectService: {
				logger: { info: () => {} }
			}
		} as unknown as ts.server.Project,
		config: { globalCss: cssFile },
		serverHost: {} as unknown as ts.server.ServerHost
	};

	// Profile each phase
	console.log('Phase 1: Plugin Initialization');
	const initStart = performance.now();
	const plugin = pluginFactory({ typescript: ts });
	const proxy = plugin.create(mockInfo);
	await plugin.getInitializationPromise();
	const initEnd = performance.now();
	console.log(`  Time: ${(initEnd - initStart).toFixed(2)}ms`);
	console.log();

	// Get AST
	const program = languageService.getProgram()!;
	const sourceFile = program.getSourceFile(testFile)!;

	// Profile AST traversal
	console.log('Phase 2: AST Traversal (finding JSX nodes)');
	let jsxNodeCount = 0;
	const traversalStart = performance.now();

	function countJsxNodes(node: ts.Node) {
		if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
			jsxNodeCount++;
		}
		ts.forEachChild(node, countJsxNodes);
	}

	countJsxNodes(sourceFile);
	const traversalEnd = performance.now();
	console.log(`  JSX nodes found: ${jsxNodeCount}`);
	console.log(`  Total nodes visited: ~${sourceFile.getChildCount()}`);
	console.log(`  Time: ${(traversalEnd - traversalStart).toFixed(2)}ms`);
	console.log();

	// Profile full validation
	console.log('Phase 3: Full Validation (with class extraction)');
	const validationStart = performance.now();
	const diagnostics = proxy.getSemanticDiagnostics(testFile);
	const validationEnd = performance.now();
	console.log(`  Diagnostics: ${diagnostics.filter(d => d.source === 'tw-plugin').length}`);
	console.log(`  Time: ${(validationEnd - validationStart).toFixed(2)}ms`);
	console.log();

	// Breakdown
	const extractionTime = validationEnd - validationStart - (traversalEnd - traversalStart);
	console.log('Time Breakdown:');
	console.log(`  AST Traversal:        ${(traversalEnd - traversalStart).toFixed(2)}ms`);
	console.log(`  Extraction + Validation: ${extractionTime.toFixed(2)}ms`);
	console.log(`  Total:                ${(validationEnd - validationStart).toFixed(2)}ms`);
	console.log();

	// Bottleneck analysis
	console.log('='.repeat(80));
	console.log('Bottleneck Analysis');
	console.log('='.repeat(80));
	console.log();

	const totalTime = validationEnd - validationStart;
	const traversalPercent = ((traversalEnd - traversalStart) / totalTime) * 100;
	const extractionPercent = (extractionTime / totalTime) * 100;

	console.log(`1. AST Traversal:           ${traversalPercent.toFixed(1)}%`);
	console.log(`2. Extraction + Validation: ${extractionPercent.toFixed(1)}%`);
	console.log();

	console.log('Optimization Opportunities:');
	console.log();

	if (traversalPercent > 30) {
		console.log('⚠️  AST Traversal is significant (>30%)');
		console.log('   Optimization: Early exit for non-JSX nodes');
		console.log('   Expected gain: 10-20% faster');
		console.log();
	}

	if (extractionPercent > 50) {
		console.log('⚠️  Extraction + Validation is the main bottleneck (>50%)');
		console.log('   Optimizations:');
		console.log('   1. Fast path for string literals (most common)');
		console.log('   2. Reduce extractor canHandle() checks');
		console.log('   3. Object pooling for ClassNameInfo');
		console.log('   Expected gain: 20-30% faster');
		console.log();
	}

	console.log('Additional optimizations:');
	console.log('  - Cache extractor instances (avoid recreation)');
	console.log('  - Use Set instead of Array for faster lookups');
	console.log('  - Inline hot paths to reduce function call overhead');
	console.log();

	// Cleanup
	fs.rmSync(tempDir, { recursive: true, force: true });
}

profilePlugin().catch(console.error);
