/**
 * Performance Benchmark Runner
 * Compares old (monolithic) vs new (refactored) plugin implementation
 */
import * as ts from 'typescript/lib/tsserverlibrary';
import fs from 'fs';
import os from 'os';
import path from 'path';

// Import type from our source to ensure type safety
import type { TailwindTypescriptPlugin } from '../src/plugin/TailwindTypescriptPlugin';

// Type definition for the plugin factory
// We use require() here (not import) because we need to dynamically load
// different versions (OLD vs NEW) based on the pluginPath variable at runtime
type PluginFactory = (mod: { typescript: typeof ts }) => TailwindTypescriptPlugin;

interface BenchmarkResult {
	version: 'old' | 'new';
	fileName: string;
	fileSize: number;
	linesOfCode: number;
	classNameCount: number;
	invalidClassCount: number;
	runs: {
		run1: number;
		run2: number;
		run3: number;
		run4: number;
		run5: number;
		average: number;
		median: number;
	};
	memoryUsage: {
		heapUsed: number;
		heapTotal: number;
	};
}

/**
 * Run plugin diagnostics on a file multiple times and measure performance
 */
async function benchmarkFile(
	filePath: string,
	pluginPath: string,
	version: 'old' | 'new'
): Promise<BenchmarkResult> {
	const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), `tailwind-benchmark-${version}-`));

	try {
		const cssFile = path.join(tempDir, 'global.css');
		fs.writeFileSync(cssFile, '@import "tailwindcss";');

		// Get file stats
		const content = fs.readFileSync(filePath, 'utf-8');
		const fileSize = Buffer.byteLength(content);
		const linesOfCode = content.split('\n').length;
		const classNameCount = (content.match(/className/g) || []).length;

		// Create TypeScript config
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

		// Create language service
		const configPath = ts.findConfigFile(tempDir, ts.sys.fileExists, 'tsconfig.json');
		const configFile = ts.readConfigFile(configPath!, ts.sys.readFile);
		const parsedConfig = ts.parseJsonConfigFileContent(configFile.config, ts.sys, tempDir);

		const languageService = ts.createLanguageService(
			{
				getCompilationSettings: () => parsedConfig.options,
				getScriptFileNames: () => [filePath],
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
						info: () => {} // Silent logger
					}
				}
			} as unknown as ts.server.Project,
			config: {
				globalCss: cssFile
			},
			serverHost: {} as unknown as ts.server.ServerHost
		};

		// Load the plugin (old or new version)
		// Clear cache to ensure fresh load for each benchmark run
		delete require.cache[require.resolve(pluginPath)];
		// Use require with proper typing for dynamic module loading
		const pluginFactory = require(pluginPath) as PluginFactory;

		// Initialize plugin
		const plugin = pluginFactory({ typescript: ts });
		const proxy = plugin.create(mockInfo);

		// Wait for validator to initialize
		await plugin.getInitializationPromise();

		// Warm up (first run to initialize everything)
		proxy.getSemanticDiagnostics(filePath);

		// Force garbage collection if available
		if (global.gc) {
			global.gc();
		}

		// Measure memory before benchmarking
		const memBefore = process.memoryUsage();

		// Run 5 times for statistical significance
		const times: number[] = [];
		let invalidClassCount = 0;

		for (let i = 0; i < 5; i++) {
			const start = performance.now();
			const diagnostics = proxy.getSemanticDiagnostics(filePath);
			const end = performance.now();
			times.push(end - start);

			// Store invalid class count from first run
			if (i === 0) {
				invalidClassCount = diagnostics.filter(
					(d: ts.Diagnostic) => d.source === 'tw-plugin'
				).length;
			}
		}

		// Measure memory after benchmarking
		const memAfter = process.memoryUsage();

		// Calculate statistics
		const average = times.reduce((a, b) => a + b, 0) / times.length;
		const sorted = [...times].sort((a, b) => a - b);
		const median = sorted[Math.floor(sorted.length / 2)];

		return {
			version,
			fileName: path.basename(filePath),
			fileSize,
			linesOfCode,
			classNameCount,
			invalidClassCount: invalidClassCount || 0,
			runs: {
				run1: times[0],
				run2: times[1],
				run3: times[2],
				run4: times[3],
				run5: times[4],
				average,
				median
			},
			memoryUsage: {
				heapUsed: memAfter.heapUsed - memBefore.heapUsed,
				heapTotal: memAfter.heapTotal - memBefore.heapTotal
			}
		};
	} finally {
		// Cleanup
		fs.rmSync(tempDir, { recursive: true, force: true });
	}
}

/**
 * Run the complete benchmark suite
 */
async function runBenchmark() {
	console.log('='.repeat(100));
	console.log('Performance Benchmark: Old vs New Implementation');
	console.log('='.repeat(100));
	console.log();

	const testFile = path.join(__dirname, 'test-files', 'AllUseCases.tsx');
	const oldPluginPath = path.join(__dirname, '..', 'lib', 'index.old.js');
	const newPluginPath = path.join(__dirname, '..', 'lib', 'index.js');

	// Check if old version exists
	const hasOldVersion = fs.existsSync(oldPluginPath);

	if (!hasOldVersion) {
		console.log('⚠️  Old version not found at:', oldPluginPath);
		console.log('   To compare with old version, ensure lib/index.old.js exists');
		console.log('   (compile src/index.old.ts to lib/)');
		console.log();
	}

	// Benchmark new version
	console.log('Benchmarking NEW (refactored) implementation...');
	const newResult = await benchmarkFile(testFile, newPluginPath, 'new');
	console.log('✓ Complete\n');

	let oldResult: BenchmarkResult | null = null;

	if (hasOldVersion) {
		console.log('Benchmarking OLD (monolithic) implementation...');
		oldResult = await benchmarkFile(testFile, oldPluginPath, 'old');
		console.log('✓ Complete\n');
	}

	// Print results
	console.log('='.repeat(100));
	console.log('Results');
	console.log('='.repeat(100));
	console.log();

	// File info
	console.log('Test File: AllUseCases.tsx');
	console.log('-'.repeat(100));
	console.log(`  Size:              ${(newResult.fileSize / 1024).toFixed(2)} KB`);
	console.log(`  Lines of Code:     ${newResult.linesOfCode.toLocaleString()}`);
	console.log(`  className usages:  ${newResult.classNameCount.toLocaleString()}`);
	console.log(`  Invalid classes:   ${newResult.invalidClassCount}`);
	console.log();

	// New version results
	console.log('NEW Implementation (Refactored with Clean Architecture + SOLID)');
	console.log('-'.repeat(100));
	console.log('  Execution Times:');
	console.log(`    Run 1:     ${newResult.runs.run1.toFixed(2)}ms`);
	console.log(`    Run 2:     ${newResult.runs.run2.toFixed(2)}ms`);
	console.log(`    Run 3:     ${newResult.runs.run3.toFixed(2)}ms`);
	console.log(`    Run 4:     ${newResult.runs.run4.toFixed(2)}ms`);
	console.log(`    Run 5:     ${newResult.runs.run5.toFixed(2)}ms`);
	console.log(`    Average:   ${newResult.runs.average.toFixed(2)}ms`);
	console.log(`    Median:    ${newResult.runs.median.toFixed(2)}ms`);
	console.log();
	console.log('  Memory:');
	console.log(`    Heap Used:  ${(newResult.memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`);
	console.log();

	if (oldResult) {
		// Old version results
		console.log('OLD Implementation (Monolithic)');
		console.log('-'.repeat(100));
		console.log('  Execution Times:');
		console.log(`    Run 1:     ${oldResult.runs.run1.toFixed(2)}ms`);
		console.log(`    Run 2:     ${oldResult.runs.run2.toFixed(2)}ms`);
		console.log(`    Run 3:     ${oldResult.runs.run3.toFixed(2)}ms`);
		console.log(`    Run 4:     ${oldResult.runs.run4.toFixed(2)}ms`);
		console.log(`    Run 5:     ${oldResult.runs.run5.toFixed(2)}ms`);
		console.log(`    Average:   ${oldResult.runs.average.toFixed(2)}ms`);
		console.log(`    Median:    ${oldResult.runs.median.toFixed(2)}ms`);
		console.log();
		console.log('  Memory:');
		console.log(`    Heap Used:  ${(oldResult.memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`);
		console.log();

		// Comparison
		console.log('='.repeat(100));
		console.log('Comparison: NEW vs OLD');
		console.log('='.repeat(100));

		const speedup = oldResult.runs.average / newResult.runs.average;
		const timeSaved = oldResult.runs.average - newResult.runs.average;
		const percentFaster =
			((oldResult.runs.average - newResult.runs.average) / oldResult.runs.average) * 100;

		console.log('  Performance:');
		if (speedup > 1) {
			console.log(`    ✅ NEW is ${speedup.toFixed(2)}x FASTER`);
			console.log(
				`    ✅ Time saved: ${timeSaved.toFixed(2)}ms (${percentFaster.toFixed(1)}% faster)`
			);
		} else if (speedup < 1) {
			const slowdown = 1 / speedup;
			console.log(`    ⚠️  NEW is ${slowdown.toFixed(2)}x SLOWER`);
			console.log(`    ⚠️  Time added: ${Math.abs(timeSaved).toFixed(2)}ms`);
		} else {
			console.log(`    ➡️  Performance is equivalent`);
		}
		console.log();

		const memDiff = newResult.memoryUsage.heapUsed - oldResult.memoryUsage.heapUsed;
		const memDiffMB = memDiff / 1024 / 1024;

		console.log('  Memory:');
		if (memDiff < 0) {
			console.log(`    ✅ NEW uses ${Math.abs(memDiffMB).toFixed(2)} MB LESS memory`);
		} else if (memDiff > 0) {
			console.log(`    ⚠️  NEW uses ${memDiffMB.toFixed(2)} MB MORE memory`);
		} else {
			console.log(`    ➡️  Memory usage is equivalent`);
		}
		console.log();
	}

	// Save results
	const resultsFile = path.join(__dirname, 'results', 'benchmark-results.json');
	const timestamp = new Date().toISOString();

	interface HistoryEntry {
		timestamp: string;
		new: BenchmarkResult;
		old?: BenchmarkResult | null;
	}

	let history: HistoryEntry[] = [];
	if (fs.existsSync(resultsFile)) {
		history = JSON.parse(fs.readFileSync(resultsFile, 'utf-8'));
	}

	history.push({
		timestamp,
		new: newResult,
		old: oldResult
	});

	fs.writeFileSync(resultsFile, JSON.stringify(history, null, 2));

	console.log('Results saved to:', resultsFile);
	console.log();
}

// Run with --expose-gc to enable garbage collection
if (!global.gc) {
	console.log('⚠️  Run with --expose-gc flag for more accurate memory measurements:');
	console.log('   node --expose-gc -r ts-node/register performance/run-benchmark.ts');
	console.log();
}

runBenchmark().catch(console.error);
