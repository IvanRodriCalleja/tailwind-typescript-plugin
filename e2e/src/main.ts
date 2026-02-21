import * as monaco from 'monaco-editor';

import babelParserTypes from '../node_modules/@babel/parser/typings/babel-parser.d.ts?raw';
import babelTypesTypes from '../node_modules/@babel/types/lib/index.d.ts?raw';
import vueCompilerCoreTypes from '../node_modules/@vue/compiler-core/dist/compiler-core.d.ts?raw';
import vueCompilerDomTypes from '../node_modules/@vue/compiler-dom/dist/compiler-dom.d.ts?raw';
import vueReactivityTypes from '../node_modules/@vue/reactivity/dist/reactivity.d.ts?raw';
import vueRuntimeCoreTypes from '../node_modules/@vue/runtime-core/dist/runtime-core.d.ts?raw';
import vueRuntimeDomTypes from '../node_modules/@vue/runtime-dom/dist/runtime-dom.d.ts?raw';
import vueSharedTypes from '../node_modules/@vue/shared/dist/shared.d.ts?raw';
import csstypeTypes from '../node_modules/csstype/index.d.ts?raw';
import vueTypes from '../node_modules/vue/dist/vue.d.ts?raw';
import vueJsxRuntimeTypes from '../node_modules/vue/jsx-runtime/index.d.ts?raw';
import vueJsxTypes from '../node_modules/vue/jsx.d.ts?raw';
import {
	type CodeActionResult,
	type DiagnosticResult,
	type TestCaseInfo,
	fetchCodeActions,
	fetchCompletions,
	fetchCustomDiagnostics,
	fetchDiagnostics,
	fetchTestCaseInfo
} from './api-client';

// Configure Monaco workers
self.MonacoEnvironment = {
	getWorker(_workerId: string, label: string) {
		if (label === 'typescript' || label === 'javascript') {
			return new Worker(
				new URL('monaco-editor/esm/vs/language/typescript/ts.worker.js', import.meta.url),
				{ type: 'module' }
			);
		}
		return new Worker(new URL('monaco-editor/esm/vs/editor/editor.worker.js', import.meta.url), {
			type: 'module'
		});
	}
};

// Types for our test API
interface DiagnosticInfo {
	message: string;
	severity: 'error' | 'warning' | 'info' | 'hint';
	startLine: number;
	startColumn: number;
	endLine: number;
	endColumn: number;
	code?: number;
	source?: string;
}

interface CompletionInfo {
	label: string;
	kind: string;
	detail?: string;
	insertText: string;
}

interface CodeActionInfo {
	title: string;
	kind?: string;
}

interface EditorMarkerInfo {
	coveredText: string;
	message: string;
	severity: 'error' | 'warning' | 'info' | 'hint';
	startLine: number;
	startColumn: number;
	endLine: number;
	endColumn: number;
	code: number;
	source: string;
}

function markerSeverityToString(
	severity: monaco.MarkerSeverity
): 'error' | 'warning' | 'info' | 'hint' {
	switch (severity) {
		case monaco.MarkerSeverity.Error:
			return 'error';
		case monaco.MarkerSeverity.Warning:
			return 'warning';
		case monaco.MarkerSeverity.Hint:
			return 'hint';
		default:
			return 'info';
	}
}

function severityToSquigglyClassName(severity: monaco.MarkerSeverity): string {
	switch (severity) {
		case monaco.MarkerSeverity.Error:
			return 'squiggly-error';
		case monaco.MarkerSeverity.Warning:
			return 'squiggly-warning';
		case monaco.MarkerSeverity.Hint:
			return 'squiggly-hint';
		default:
			return 'squiggly-info';
	}
}

interface TestAPI {
	editor: monaco.editor.IStandaloneCodeEditor;
	setContent: (content: string) => void;
	getContent: () => string;
	setCursorPosition: (line: number, column: number) => void;
	getCursorPosition: () => { line: number; column: number };
	getDiagnostics: () => Promise<DiagnosticInfo[]>;
	triggerCompletion: () => Promise<CompletionInfo[]>;
	getCompletions: (line: number, column: number) => Promise<CompletionInfo[]>;
	getCodeActions: (line: number, column: number) => Promise<CodeActionInfo[]>;
	applyCodeAction: (actionIndex: number) => Promise<void>;
	typeText: (text: string) => void;
	waitForDiagnostics: () => Promise<DiagnosticInfo[]>;
	getTestCaseInfo: () => TestCaseInfo | null;
	refreshDiagnostics: () => Promise<void>;
	setLanguage: (lang: 'typescriptreact' | 'vue') => void;
	setPluginConfig: (config: Record<string, unknown>) => void;
	getEditorMarkers: () => EditorMarkerInfo[];
}

// Current state
let currentTestCase: TestCaseInfo | null = null;
let currentDiagnostics: DiagnosticResult[] = [];
let currentCodeActions: CodeActionResult[] = [];
let currentPluginConfig: Record<string, unknown> = {};
let currentLanguage: 'tsx' | 'vue' = 'tsx';

/**
 * Parse the URL path to determine the test case.
 * Format: /:framework/:category/:name
 */
function parseTestCaseFromUrl(): { framework: string; category: string; name: string } | null {
	const path = window.location.pathname;
	const match = path.match(/^\/([^/]+)\/([^/]+)\/([^/]+)$/);
	if (match) {
		return { framework: match[1], category: match[2], name: match[3] };
	}
	return null;
}

/**
 * Map backend diagnostic category to Monaco severity.
 */
function categoryToSeverity(category: string): monaco.MarkerSeverity {
	switch (category) {
		case 'error':
			return monaco.MarkerSeverity.Error;
		case 'warning':
			return monaco.MarkerSeverity.Warning;
		case 'suggestion':
			return monaco.MarkerSeverity.Hint;
		default:
			return monaco.MarkerSeverity.Info;
	}
}

/**
 * Map backend diagnostics to Monaco markers.
 */
function diagnosticsToMarkers(diagnostics: DiagnosticResult[]): monaco.editor.IMarkerData[] {
	return diagnostics.map(d => ({
		severity: categoryToSeverity(d.category),
		message: d.message,
		startLineNumber: d.line,
		startColumn: d.column,
		endLineNumber: d.endLine,
		endColumn: d.endColumn,
		code: String(d.code),
		source: d.source || 'tw-plugin'
	}));
}

/**
 * Map backend diagnostic to DiagnosticInfo for the test API.
 */
function toDiagnosticInfo(d: DiagnosticResult): DiagnosticInfo {
	return {
		message: d.message,
		severity:
			d.category === 'error'
				? 'error'
				: d.category === 'warning'
					? 'warning'
					: d.category === 'suggestion'
						? 'hint'
						: 'info',
		startLine: d.line,
		startColumn: d.column,
		endLine: d.endLine,
		endColumn: d.endColumn,
		code: d.code,
		source: d.source
	};
}

function verifySquigglyDom(
	editor: monaco.editor.IStandaloneCodeEditor,
	markers: monaco.editor.IMarker[]
): void {
	if (markers.length === 0) return;

	const model = editor.getModel();
	if (!model) return;

	// Force synchronous rendering of pending decoration changes
	editor.render(true);

	// Step 1: Verify decorations exist for each marker
	const allDecorations = model.getAllDecorations();
	const squigglyDecorations = allDecorations.filter(
		d =>
			d.options.className &&
			(d.options.className.includes('squiggly-error') ||
				d.options.className.includes('squiggly-warning') ||
				d.options.className.includes('squiggly-info') ||
				d.options.className.includes('squiggly-hint'))
	);

	const missingDecorations: string[] = [];
	for (const marker of markers) {
		const expectedClass = severityToSquigglyClassName(marker.severity);
		const found = squigglyDecorations.some(
			d =>
				d.options.className?.includes(expectedClass) &&
				d.range.startLineNumber === marker.startLineNumber &&
				d.range.startColumn === marker.startColumn &&
				d.range.endLineNumber === marker.endLineNumber &&
				d.range.endColumn === marker.endColumn
		);
		if (!found) {
			missingDecorations.push(
				`Missing decoration: ${expectedClass} at ${marker.startLineNumber}:${marker.startColumn}-${marker.endLineNumber}:${marker.endColumn} "${marker.message}"`
			);
		}
	}

	if (missingDecorations.length > 0) {
		throw new Error(
			`DOM squiggly verification failed — missing decorations:\n${missingDecorations.join('\n')}`
		);
	}

	// Step 2: Verify DOM squiggly elements exist in .view-overlays
	const editorDomNode = editor.getDomNode();
	if (!editorDomNode) return;

	const viewOverlays = editorDomNode.querySelector('.view-overlays');
	if (!viewOverlays) return;

	const domSquigglies = viewOverlays.querySelectorAll(
		'.squiggly-error, .squiggly-warning, .squiggly-info, .squiggly-hint'
	);

	// Verify at least one DOM element exists for each severity class present in markers
	const expectedClasses = new Set(markers.map(m => severityToSquigglyClassName(m.severity)));
	const missingDom: string[] = [];

	for (const cls of expectedClasses) {
		const hasDomElement = Array.from(domSquigglies).some(el => el.classList.contains(cls));
		if (!hasDomElement) {
			missingDom.push(`No DOM element with class "${cls}" found in .view-overlays`);
		}
	}

	if (missingDom.length > 0) {
		throw new Error(
			`DOM squiggly verification failed — missing DOM elements:\n${missingDom.join('\n')}`
		);
	}
}

async function initEditor(): Promise<TestAPI> {
	const container = document.getElementById('editor-container')!;
	const statusEl = document.getElementById('status')!;
	const diagnosticsListEl = document.getElementById('diagnostics-list')!;
	const testCaseInfoEl = document.getElementById('test-case-info');
	const tsconfigContentEl = document.getElementById('tsconfig-content');

	// Configure TypeScript defaults
	monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
		target: monaco.languages.typescript.ScriptTarget.ESNext,
		module: monaco.languages.typescript.ModuleKind.ESNext,
		jsx: monaco.languages.typescript.JsxEmit.React,
		strict: true,
		esModuleInterop: true,
		skipLibCheck: true,
		moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs
	});

	// Add React types
	monaco.languages.typescript.typescriptDefaults.addExtraLib(
		`
    declare namespace React {
      interface HTMLAttributes<T> { className?: string; }
      function createElement(type: any, props?: any, ...children: any[]): any;
    }
    declare namespace JSX {
      interface IntrinsicElements {
        [elemName: string]: React.HTMLAttributes<HTMLElement>;
      }
    }
    `,
		'react.d.ts'
	);

	// Add Vue types (real type declarations loaded from node_modules)
	const vueExtraLibs: [string, string][] = [
		// Leaf dependencies
		[csstypeTypes, 'file:///node_modules/csstype/index.d.ts'],
		[babelTypesTypes, 'file:///node_modules/@babel/types/index.d.ts'],
		[babelParserTypes, 'file:///node_modules/@babel/parser/index.d.ts'],
		[vueSharedTypes, 'file:///node_modules/@vue/shared/index.d.ts'],
		// Mid-level
		[vueReactivityTypes, 'file:///node_modules/@vue/reactivity/index.d.ts'],
		[vueCompilerCoreTypes, 'file:///node_modules/@vue/compiler-core/index.d.ts'],
		[vueRuntimeCoreTypes, 'file:///node_modules/@vue/runtime-core/index.d.ts'],
		// Upper level
		[vueRuntimeDomTypes, 'file:///node_modules/@vue/runtime-dom/index.d.ts'],
		[vueCompilerDomTypes, 'file:///node_modules/@vue/compiler-dom/index.d.ts'],
		// Top level
		[vueTypes, 'file:///node_modules/vue/index.d.ts'],
		[vueJsxRuntimeTypes, 'file:///node_modules/vue/jsx-runtime/index.d.ts'],
		[vueJsxTypes, 'file:///node_modules/vue/jsx.d.ts']
	];
	for (const [content, filePath] of vueExtraLibs) {
		monaco.languages.typescript.typescriptDefaults.addExtraLib(content, filePath);
	}

	// Create editor
	const editor = monaco.editor.create(container, {
		value: '',
		language: 'typescript',
		theme: 'vs-dark',
		automaticLayout: true,
		minimap: { enabled: false },
		fontSize: 14,
		lineNumbers: 'on',
		scrollBeyondLastLine: false,
		wordWrap: 'on',
		tabSize: 2,
		readOnly: false
	});

	function updateDiagnosticsUI(diagnostics: DiagnosticResult[]) {
		diagnosticsListEl.innerHTML = '';

		if (diagnostics.length === 0) {
			diagnosticsListEl.innerHTML =
				'<div style="padding: 12px; color: #888;">No issues found</div>';
			return;
		}

		for (const diag of diagnostics) {
			const item = document.createElement('div');
			const isError = diag.category === 'error';
			item.className = `diagnostic-item ${isError ? 'error' : 'warning'}`;
			item.setAttribute('data-testid', `diagnostic-${diag.code}`);
			item.innerHTML = `
        <div class="message">${diag.message}</div>
        <div class="location">Line ${diag.line}, Col ${diag.column}</div>
      `;
			item.onclick = () => {
				editor.setPosition({ lineNumber: diag.line, column: diag.column });
				editor.focus();
				editor.revealLineInCenter(diag.line);
			};
			diagnosticsListEl.appendChild(item);
		}
	}

	function updateTestCaseInfoUI(info: TestCaseInfo | null) {
		if (!testCaseInfoEl) return;
		if (!info) {
			testCaseInfoEl.innerHTML = '<span>No test case loaded</span>';
			if (tsconfigContentEl) tsconfigContentEl.textContent = '';
			return;
		}
		testCaseInfoEl.innerHTML = `
      <span class="badge framework">${info.framework}</span>
      <span class="badge category">${info.category}</span>
      <span class="badge name">${info.name}</span>
      <span class="badge config" title="${JSON.stringify(info.config, null, 2).replace(/"/g, '&quot;')}">${info.expectations.comment || 'config'}</span>
    `;
		if (tsconfigContentEl) {
			tsconfigContentEl.textContent = JSON.stringify(info.tsconfig, null, 2);
		}
	}

	/**
	 * Fetch diagnostics from the backend and update Monaco markers.
	 */
	async function refreshDiagnostics(): Promise<void> {
		const model = editor.getModel();
		if (!model) return;

		let diagnostics: DiagnosticResult[];

		if (currentTestCase) {
			diagnostics = await fetchDiagnostics(
				currentTestCase.filePath.replace(/\/example\.(tsx|vue|astro)$/, '')
			);
		} else {
			// Custom code mode
			const code = model.getValue();
			diagnostics = await fetchCustomDiagnostics(code, currentLanguage, currentPluginConfig);
		}

		currentDiagnostics = diagnostics;
		const markers = diagnosticsToMarkers(diagnostics);
		monaco.editor.setModelMarkers(model, 'tailwind', markers);
		updateDiagnosticsUI(diagnostics);
	}

	// Check URL for test case
	const urlTestCase = parseTestCaseFromUrl();

	if (urlTestCase) {
		statusEl.textContent = 'Loading test case...';
		try {
			const info = await fetchTestCaseInfo(
				urlTestCase.framework,
				urlTestCase.category,
				urlTestCase.name
			);
			currentTestCase = info;

			const lang = info.language === 'vue' ? 'typescript' : 'typescript';
			const model = editor.getModel();
			if (model) {
				monaco.editor.setModelLanguage(model, lang);
			}

			editor.setValue(info.code);
			updateTestCaseInfoUI(info);

			await refreshDiagnostics();
		} catch (err) {
			statusEl.textContent = 'Error';
			statusEl.className = 'status error';
			console.error('Failed to load test case:', err);
		}
	} else {
		// Landing page / custom code mode
		const initialCode = `// Test file for Tailwind CSS validation
export function MyComponent() {
  return (
    <div className="flex items-center gap-4 p-4">
      <span className="text-lg font-bold text-gray-900">
        Hello World
      </span>
      <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Click me
      </button>
    </div>
  );
}
`;
		editor.setValue(initialCode);
		updateTestCaseInfoUI(null);
	}

	// Register code action provider
	monaco.languages.registerCodeActionProvider('typescript', {
		async provideCodeActions(model, _range, context) {
			const actions: monaco.languages.CodeAction[] = [];

			if (!currentTestCase) {
				return { actions, dispose: () => {} };
			}

			for (const marker of context.markers) {
				if (marker.source !== 'tw-plugin' && marker.source !== 'tailwind-typescript-plugin')
					continue;

				const code = parseInt(String(marker.code));
				const startOffset = model.getOffsetAt({
					lineNumber: marker.startLineNumber,
					column: marker.startColumn
				});
				const endOffset = model.getOffsetAt({
					lineNumber: marker.endLineNumber,
					column: marker.endColumn
				});

				try {
					const testDir = currentTestCase.filePath.replace(/\/example\.(tsx|vue|astro)$/, '');
					const codeActions = await fetchCodeActions(testDir, startOffset, endOffset, [code]);
					currentCodeActions = codeActions;

					for (const action of codeActions) {
						const edits: monaco.languages.IWorkspaceTextEdit[] = [];
						for (const change of action.changes) {
							for (const tc of change.textChanges) {
								const startPos = model.getPositionAt(tc.span.start);
								const endPos = model.getPositionAt(tc.span.start + tc.span.length);
								edits.push({
									resource: model.uri,
									textEdit: {
										range: {
											startLineNumber: startPos.lineNumber,
											startColumn: startPos.column,
											endLineNumber: endPos.lineNumber,
											endColumn: endPos.column
										},
										text: tc.newText
									},
									versionId: model.getVersionId()
								});
							}
						}

						actions.push({
							title: action.description,
							kind: 'quickfix',
							diagnostics: [marker],
							edit: { edits }
						});
					}
				} catch (err) {
					console.error('Failed to fetch code actions:', err);
				}
			}

			return { actions, dispose: () => {} };
		}
	});

	statusEl.textContent = 'Ready';
	statusEl.className = 'status ready';

	// Test API
	const testAPI: TestAPI = {
		editor,

		setContent(content: string) {
			editor.setValue(content);
		},

		getContent() {
			return editor.getValue();
		},

		setCursorPosition(line: number, column: number) {
			editor.setPosition({ lineNumber: line, column });
			editor.focus();
		},

		getCursorPosition() {
			const pos = editor.getPosition();
			return { line: pos?.lineNumber ?? 1, column: pos?.column ?? 1 };
		},

		async getDiagnostics(): Promise<DiagnosticInfo[]> {
			return currentDiagnostics.map(toDiagnosticInfo);
		},

		async triggerCompletion(): Promise<CompletionInfo[]> {
			if (!currentTestCase) return [];

			const position = editor.getPosition();
			if (!position) return [];

			const model = editor.getModel();
			if (!model) return [];

			const offset = model.getOffsetAt(position);
			const testDir = currentTestCase.filePath.replace(/\/example\.(tsx|vue|astro)$/, '');

			try {
				const completions = await fetchCompletions(testDir, offset);
				return completions.map(c => ({
					label: c.name,
					kind: c.kind,
					insertText: c.name
				}));
			} catch {
				return [];
			}
		},

		async getCompletions(line: number, column: number): Promise<CompletionInfo[]> {
			if (!currentTestCase) return [];

			const model = editor.getModel();
			if (!model) return [];

			const offset = model.getOffsetAt({ lineNumber: line, column });
			const testDir = currentTestCase.filePath.replace(/\/example\.(tsx|vue|astro)$/, '');

			try {
				const completions = await fetchCompletions(testDir, offset);
				return completions.map(c => ({
					label: c.name,
					kind: c.kind,
					insertText: c.name
				}));
			} catch {
				return [];
			}
		},

		async getCodeActions(line: number): Promise<CodeActionInfo[]> {
			if (!currentTestCase) return [];

			const model = editor.getModel();
			if (!model) return [];

			// Find markers on this line
			const markers = monaco.editor
				.getModelMarkers({ resource: model.uri })
				.filter(m => m.startLineNumber <= line && m.endLineNumber >= line);

			if (markers.length === 0) return [];

			const allActions: CodeActionInfo[] = [];
			currentCodeActions = [];

			for (const marker of markers) {
				const code = parseInt(String(marker.code));
				const startOffset = model.getOffsetAt({
					lineNumber: marker.startLineNumber,
					column: marker.startColumn
				});
				const endOffset = model.getOffsetAt({
					lineNumber: marker.endLineNumber,
					column: marker.endColumn
				});

				try {
					const testDir = currentTestCase.filePath.replace(/\/example\.(tsx|vue|astro)$/, '');
					const codeActions = await fetchCodeActions(testDir, startOffset, endOffset, [code]);
					currentCodeActions.push(...codeActions);

					for (const action of codeActions) {
						allActions.push({
							title: action.description,
							kind: 'quickfix'
						});
					}
				} catch {
					// ignore
				}
			}

			return allActions;
		},

		async applyCodeAction(actionIndex: number): Promise<void> {
			if (actionIndex < 0 || actionIndex >= currentCodeActions.length) {
				throw new Error(`Invalid action index: ${actionIndex}`);
			}

			const model = editor.getModel();
			if (!model) return;

			const action = currentCodeActions[actionIndex];
			for (const change of action.changes) {
				for (const tc of change.textChanges) {
					const startPos = model.getPositionAt(tc.span.start);
					const endPos = model.getPositionAt(tc.span.start + tc.span.length);
					model.applyEdits([
						{
							range: new monaco.Range(
								startPos.lineNumber,
								startPos.column,
								endPos.lineNumber,
								endPos.column
							),
							text: tc.newText
						}
					]);
				}
			}
		},

		typeText(text: string) {
			editor.trigger('test', 'type', { text });
		},

		async waitForDiagnostics(): Promise<DiagnosticInfo[]> {
			// The backend processes diagnostics synchronously in a single call,
			// so one refresh is sufficient — no polling needed.
			await refreshDiagnostics();
			return currentDiagnostics.map(toDiagnosticInfo);
		},

		getTestCaseInfo() {
			return currentTestCase;
		},

		async refreshDiagnostics() {
			await refreshDiagnostics();
		},

		setLanguage(lang: 'typescriptreact' | 'vue') {
			currentLanguage = lang === 'vue' ? 'vue' : 'tsx';
			const model = editor.getModel();
			if (model) {
				monaco.editor.setModelLanguage(model, 'typescript');
			}
		},

		setPluginConfig(config: Record<string, unknown>) {
			currentPluginConfig = config;
		},

		getEditorMarkers(): EditorMarkerInfo[] {
			const model = editor.getModel();
			if (!model) return [];
			const allMarkers = monaco.editor.getModelMarkers({ resource: model.uri });

			// Only consider plugin markers (owner: 'tailwind'). Monaco's built-in
			// TypeScript service may produce environment-dependent noise markers
			// (e.g. "Cannot find module 'vue'") that are non-deterministic across
			// CI and local environments.
			const markers = allMarkers.filter(m => m.owner === 'tailwind');

			// Verify full rendering pipeline: markers → decorations → DOM squigglies
			verifySquigglyDom(editor, markers);

			return markers.map(m => ({
				coveredText: model.getValueInRange(
					new monaco.Range(m.startLineNumber, m.startColumn, m.endLineNumber, m.endColumn)
				),
				message: m.message,
				severity: markerSeverityToString(m.severity),
				startLine: m.startLineNumber,
				startColumn: m.startColumn,
				endLine: m.endLineNumber,
				endColumn: m.endColumn,
				code:
					typeof m.code === 'object'
						? Number((m.code as { value: string }).value)
						: Number(m.code ?? 0),
				source: m.source ?? ''
			}));
		}
	};

	(window as unknown as { testAPI: TestAPI }).testAPI = testAPI;

	return testAPI;
}

// Initialize
initEditor().catch(console.error);
