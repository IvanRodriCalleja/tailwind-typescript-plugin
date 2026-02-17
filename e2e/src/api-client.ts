/**
 * Frontend API client for communicating with the Vite plugin server.
 */

export interface TestCaseEntry {
	framework: string;
	category: string;
	name: string;
	path: string;
}

export interface TestCaseInfo {
	code: string;
	language: 'typescriptreact' | 'vue';
	config: Record<string, unknown>;
	tsconfig: Record<string, unknown>;
	filePath: string;
	framework: string;
	category: string;
	name: string;
	expectations: {
		shouldBeValid: boolean;
		comment: string;
		invalidClasses: string[];
		validClasses: string[];
		duplicateClasses: string[];
		extractableClasses: string[];
		conflictClasses: string[];
	};
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

export async function fetchTestCases(): Promise<TestCaseEntry[]> {
	const res = await fetch('/api/test-cases');
	if (!res.ok) throw new Error(`Failed to fetch test cases: ${res.statusText}`);
	return res.json();
}

export async function fetchTestCaseInfo(
	framework: string,
	category: string,
	name: string
): Promise<TestCaseInfo> {
	const res = await fetch(`/api/test-case/${framework}/${category}/${name}`);
	if (!res.ok) throw new Error(`Failed to fetch test case: ${res.statusText}`);
	return res.json();
}

export async function fetchDiagnostics(testCasePath: string): Promise<DiagnosticResult[]> {
	const res = await fetch('/api/diagnostics', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ testCasePath })
	});
	if (!res.ok) throw new Error(`Failed to fetch diagnostics: ${res.statusText}`);
	return res.json();
}

export async function fetchCompletions(
	testCasePath: string,
	position: number
): Promise<CompletionResult[]> {
	const res = await fetch('/api/completions', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ testCasePath, position })
	});
	if (!res.ok) throw new Error(`Failed to fetch completions: ${res.statusText}`);
	return res.json();
}

export async function fetchCodeActions(
	testCasePath: string,
	start: number,
	end: number,
	errorCodes: number[]
): Promise<CodeActionResult[]> {
	const res = await fetch('/api/code-actions', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ testCasePath, start, end, errorCodes })
	});
	if (!res.ok) throw new Error(`Failed to fetch code actions: ${res.statusText}`);
	return res.json();
}

export async function fetchCustomDiagnostics(
	code: string,
	language: 'tsx' | 'vue',
	config: Record<string, unknown>
): Promise<DiagnosticResult[]> {
	const res = await fetch('/api/diagnostics/custom', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ code, language, config })
	});
	if (!res.ok) throw new Error(`Failed to fetch custom diagnostics: ${res.statusText}`);
	return res.json();
}
