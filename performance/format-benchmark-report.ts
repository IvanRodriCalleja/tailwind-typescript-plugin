/**
 * Format benchmark results as a markdown report
 * Can be used locally or in CI
 */
import fs from 'fs';
import path from 'path';

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

interface HistoryEntry {
	timestamp: string;
	new: BenchmarkResult;
	old?: BenchmarkResult | null;
}

function formatReport(entry: HistoryEntry): string {
	const newResult = entry.new;
	const oldResult = entry.old;

	// Build markdown report
	let report = '## 📊 Performance Benchmark Results\n\n';

	// Test file details
	report += '### Test File Details\n';
	report += `- **File**: ${newResult.fileName}\n`;
	report += `- **Size**: ${(newResult.fileSize / 1024).toFixed(2)} KB\n`;
	report += `- **Lines**: ${newResult.linesOfCode.toLocaleString()}\n`;
	report += `- **className usages**: ${newResult.classNameCount.toLocaleString()}\n`;
	report += `- **Invalid classes**: ${newResult.invalidClassCount}\n\n`;

	// Performance comparison table
	report += '### Performance Comparison\n\n';
	report += '| Implementation | Run 1 | Run 2 | Run 3 | Run 4 | Run 5 | **Average** | Status |\n';
	report += '|---|---|---|---|---|---|---|---|\n';

	// NEW row
	report += `| 🆕 **NEW** (Refactored) `;
	report += `| ${newResult.runs.run1.toFixed(2)}ms `;
	report += `| ${newResult.runs.run2.toFixed(2)}ms `;
	report += `| ${newResult.runs.run3.toFixed(2)}ms `;
	report += `| ${newResult.runs.run4.toFixed(2)}ms `;
	report += `| ${newResult.runs.run5.toFixed(2)}ms `;
	report += `| **${newResult.runs.average.toFixed(2)}ms** `;
	report += `| Clean Architecture |\n`;

	// OLD row (if available)
	if (oldResult) {
		report += `| 📦 **OLD** (Monolithic) `;
		report += `| ${oldResult.runs.run1.toFixed(2)}ms `;
		report += `| ${oldResult.runs.run2.toFixed(2)}ms `;
		report += `| ${oldResult.runs.run3.toFixed(2)}ms `;
		report += `| ${oldResult.runs.run4.toFixed(2)}ms `;
		report += `| ${oldResult.runs.run5.toFixed(2)}ms `;
		report += `| **${oldResult.runs.average.toFixed(2)}ms** `;
		report += `| Monolithic |\n`;
	}

	report += '\n';

	// Memory usage
	report += '### Memory Usage\n\n';
	report += `- **NEW**: ${(newResult.memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB heap used\n`;
	if (oldResult) {
		report += `- **OLD**: ${(oldResult.memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB heap used\n`;
	}
	report += '\n';

	// Timestamp
	report += '---\n\n';
	report += `_Benchmark run at: ${new Date(entry.timestamp).toLocaleString()}_\n`;

	return report;
}

// Main execution
const resultsFile = path.join(__dirname, 'results', 'benchmark-results.json');

if (!fs.existsSync(resultsFile)) {
	console.error('❌ No benchmark results found. Run the benchmark first:');
	console.error('   node --expose-gc -r ts-node/register performance/run-benchmark.ts');
	process.exit(1);
}

const history: HistoryEntry[] = JSON.parse(fs.readFileSync(resultsFile, 'utf-8'));

if (history.length === 0) {
	console.error('❌ No benchmark results in file');
	process.exit(1);
}

// Get the latest result
const latestResult = history[history.length - 1];

// Format and output
const report = formatReport(latestResult);

// Output to console
console.log(report);

// Optionally save to file
const reportFile = path.join(__dirname, 'results', 'latest-report.md');
fs.writeFileSync(reportFile, report);
console.log(`\n✅ Report saved to: ${reportFile}`);
