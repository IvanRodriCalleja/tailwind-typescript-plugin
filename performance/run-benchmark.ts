/**
 * Performance Benchmark Runner
 * Compares plugin performance between versions
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
 * Format benchmark results as markdown report
 */
function formatReport(newResult: BenchmarkResult, oldResult: BenchmarkResult | null): string {
	// Build markdown report
	let report = '## 📊 Performance Benchmark\n\n';

	// Performance comparison table
	report += '| Version | Run 1 | Run 2 | Run 3 | Run 4 | Run 5 | **Average** |\n';
	report += '|---------|-------|-------|-------|-------|-------|-------------|\n';

	// PR row
	report += `| **This PR** `;
	report += `| ${newResult.runs.run1.toFixed(2)}ms `;
	report += `| ${newResult.runs.run2.toFixed(2)}ms `;
	report += `| ${newResult.runs.run3.toFixed(2)}ms `;
	report += `| ${newResult.runs.run4.toFixed(2)}ms `;
	report += `| ${newResult.runs.run5.toFixed(2)}ms `;
	report += `| **${newResult.runs.average.toFixed(2)}ms** |\n`;

	// Main row (if available)
	if (oldResult) {
		report += `| **main** `;
		report += `| ${oldResult.runs.run1.toFixed(2)}ms `;
		report += `| ${oldResult.runs.run2.toFixed(2)}ms `;
		report += `| ${oldResult.runs.run3.toFixed(2)}ms `;
		report += `| ${oldResult.runs.run4.toFixed(2)}ms `;
		report += `| ${oldResult.runs.run5.toFixed(2)}ms `;
		report += `| **${oldResult.runs.average.toFixed(2)}ms** |\n`;

		// Simple comparison
		const diff = newResult.runs.average - oldResult.runs.average;
		const percentChange = ((diff / oldResult.runs.average) * 100).toFixed(1);
		const absDiff = Math.abs(diff).toFixed(2);

		report += '\n';
		if (diff < 0) {
			// Faster
			report += `✅ **${absDiff}ms faster** (${Math.abs(parseFloat(percentChange))}% improvement)\n`;
		} else if (diff > 0.5) {
			// Slower by significant amount
			report += `⚠️ **${absDiff}ms slower** (${percentChange}% slower)\n`;
		} else {
			// Within margin of error
			report += `➡️ **No significant change** (within ${absDiff}ms)\n`;
		}
	} else {
		report += '\n**Note:** No baseline available for comparison.\n';
	}

	report += '\n';

	// Memory usage
	report += '### Memory Usage\n\n';
	report += `- **This PR**: ${(newResult.memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB\n`;
	if (oldResult) {
		report += `- **main**: ${(oldResult.memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB\n`;
	}
	report += '\n';

	// Timestamp
	report += '---\n\n';
	report += `_Benchmark run at: ${new Date().toLocaleString()}_\n`;

	return report;
}

/**
 * Run the complete benchmark suite
 */
async function runBenchmark() {
	const testFile = path.join(__dirname, 'test-files', 'AllUseCases.tsx');
	const oldPluginPath = path.join(__dirname, '..', 'lib', 'index.old.js');
	const newPluginPath = path.join(__dirname, '..', 'lib', 'index.js');

	// Check if old version exists
	const hasOldVersion = fs.existsSync(oldPluginPath);

	if (!hasOldVersion) {
		console.error('⚠️  Old version not found at:', oldPluginPath);
		console.error('   To compare with old version, ensure lib/index.old.js exists');
		console.error('   (compile src/index.old.ts to lib/)');
		console.error();
	}

	// Benchmark PR version
	console.error('Benchmarking PR version...');
	const newResult = await benchmarkFile(testFile, newPluginPath, 'new');
	console.error('✓ Complete\n');

	let oldResult: BenchmarkResult | null = null;

	if (hasOldVersion) {
		console.error('Benchmarking main branch...');
		oldResult = await benchmarkFile(testFile, oldPluginPath, 'old');
		console.error('✓ Complete\n');
	}

	// Generate and output markdown report
	const report = formatReport(newResult, oldResult);
	console.log(report);
}

// Run with --expose-gc to enable garbage collection
if (!global.gc) {
	console.error('⚠️  Run with --expose-gc flag for more accurate memory measurements:');
	console.error('   node --expose-gc -r ts-node/register performance/run-benchmark.ts');
	console.error();
}

runBenchmark().catch(console.error);
