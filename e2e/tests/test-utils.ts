import { Page, expect, type APIRequestContext } from '@playwright/test';

export interface DiagnosticInfo {
  message: string;
  severity: 'error' | 'warning' | 'info' | 'hint';
  startLine: number;
  startColumn: number;
  endLine: number;
  endColumn: number;
  code?: number;
  source?: string;
}

export interface CompletionInfo {
  label: string;
  kind: string;
  insertText: string;
  detail?: string;
}

export interface CodeActionInfo {
  title: string;
  kind?: string;
}

export interface EditorMarkerInfo {
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

export interface TestAPI {
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
  refreshDiagnostics: () => Promise<void>;
  getTestCaseInfo: () => unknown;
  setLanguage: (lang: string) => void;
  setPluginConfig: (config: Record<string, unknown>) => void;
  getEditorMarkers: () => EditorMarkerInfo[];
}

/**
 * Wait for the Monaco editor to be ready
 */
export async function waitForEditorReady(page: Page): Promise<void> {
  await page.waitForSelector('[data-testid="status"].ready', { timeout: 30000 });
  await page.waitForFunction(() => (window as unknown as { testAPI: TestAPI }).testAPI !== undefined, { timeout: 30000 });
}

/**
 * Set the editor content
 */
export async function setEditorContent(page: Page, content: string): Promise<void> {
  await page.evaluate((code) => {
    (window as unknown as { testAPI: TestAPI }).testAPI.setContent(code);
  }, content);
  // Wait for diagnostics to update
  await page.waitForTimeout(500);
}

/**
 * Get the editor content
 */
export async function getEditorContent(page: Page): Promise<string> {
  return page.evaluate(() => {
    return (window as unknown as { testAPI: TestAPI }).testAPI.getContent();
  });
}

/**
 * Get diagnostics from the editor
 */
export async function getDiagnostics(page: Page): Promise<DiagnosticInfo[]> {
  return page.evaluate(async () => {
    return (window as unknown as { testAPI: TestAPI }).testAPI.getDiagnostics();
  });
}

/**
 * Wait for diagnostics from the real plugin.
 * The backend processes diagnostics synchronously, so a single refresh is sufficient.
 * Retries if execution context is destroyed (e.g. due to HMR navigation).
 */
export async function waitForDiagnostics(page: Page): Promise<DiagnosticInfo[]> {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await page.evaluate(async () => {
        return (window as unknown as { testAPI: TestAPI }).testAPI.waitForDiagnostics();
      });
    } catch (e) {
      const msg = String(e);
      if (attempt < 2 && (msg.includes('Execution context was destroyed') || msg.includes('navigation'))) {
        // Page reloaded (HMR) — wait for editor to be ready again and retry
        await page.waitForSelector('[data-testid="status"].ready', { timeout: 30000 });
        await page.waitForFunction(
          () => (window as unknown as { testAPI: TestAPI }).testAPI !== undefined,
          { timeout: 10000 },
        );
        continue;
      }
      throw e;
    }
  }
  throw new Error('Failed to get diagnostics after 3 attempts');
}

/**
 * Refresh diagnostics from the backend
 */
export async function refreshDiagnostics(page: Page): Promise<void> {
  await page.evaluate(async () => {
    return (window as unknown as { testAPI: TestAPI }).testAPI.refreshDiagnostics();
  });
}

/**
 * Set cursor position
 */
export async function setCursorPosition(page: Page, line: number, column: number): Promise<void> {
  await page.evaluate(({ l, c }) => {
    (window as unknown as { testAPI: TestAPI }).testAPI.setCursorPosition(l, c);
  }, { l: line, c: column });
}

/**
 * Get completions at a position
 */
export async function getCompletions(page: Page, line: number, column: number): Promise<CompletionInfo[]> {
  return page.evaluate(async ({ l, c }) => {
    return (window as unknown as { testAPI: TestAPI }).testAPI.getCompletions(l, c);
  }, { l: line, c: column });
}

/**
 * Get code actions at a position
 */
export async function getCodeActions(page: Page, line: number, column: number): Promise<CodeActionInfo[]> {
  await page.waitForTimeout(500);
  return page.evaluate(async ({ l, c }) => {
    return (window as unknown as { testAPI: TestAPI }).testAPI.getCodeActions(l, c);
  }, { l: line, c: column });
}

/**
 * Apply a code action by index
 */
export async function applyCodeAction(page: Page, actionIndex: number): Promise<void> {
  await page.evaluate(async (idx) => {
    return (window as unknown as { testAPI: TestAPI }).testAPI.applyCodeAction(idx);
  }, actionIndex);
  await page.waitForTimeout(300);
}

/**
 * Type text at the current cursor position
 */
export async function typeText(page: Page, text: string): Promise<void> {
  await page.evaluate((t) => {
    (window as unknown as { testAPI: TestAPI }).testAPI.typeText(t);
  }, text);
  await page.waitForTimeout(300);
}

/**
 * Filter diagnostics by code
 */
export function filterDiagnosticsByCode(diagnostics: DiagnosticInfo[], code: number): DiagnosticInfo[] {
  return diagnostics.filter(d => d.code === code);
}

/**
 * Filter diagnostics by severity
 */
export function filterDiagnosticsBySeverity(diagnostics: DiagnosticInfo[], severity: DiagnosticInfo['severity']): DiagnosticInfo[] {
  return diagnostics.filter(d => d.severity === severity);
}

/**
 * Get Monaco editor markers (squiggly underlines with covered text)
 */
export async function getEditorMarkers(page: Page): Promise<EditorMarkerInfo[]> {
  return page.evaluate(() => {
    return (window as unknown as { testAPI: TestAPI }).testAPI.getEditorMarkers();
  });
}

/**
 * Filter markers to only plugin-produced markers
 */
export function filterPluginMarkers(markers: EditorMarkerInfo[]): EditorMarkerInfo[] {
  return markers.filter(
    m => m.source === 'tw-plugin' || m.source === 'tailwind-typescript-plugin',
  );
}

/**
 * Filter markers by diagnostic code
 */
export function filterMarkersByCode(markers: EditorMarkerInfo[], code: number): EditorMarkerInfo[] {
  return markers.filter(m => m.code === code);
}

/**
 * Diagnostic codes matching the plugin
 */
export const DiagnosticCodes = {
  INVALID_CLASS: 90001,
  DUPLICATE_CLASS: 90002,
  EXTRACTABLE_CLASS: 90003,
  CONFLICT_CLASS: 90004,
} as const;

/**
 * Assert that specific diagnostics are present
 */
export async function expectDiagnostic(
  page: Page,
  options: {
    code?: number;
    messageContains?: string;
    severity?: DiagnosticInfo['severity'];
    line?: number;
  }
): Promise<void> {
  const diagnostics = await getDiagnostics(page);

  const matching = diagnostics.filter(d => {
    if (options.code !== undefined && d.code !== options.code) return false;
    if (options.messageContains && !d.message.includes(options.messageContains)) return false;
    if (options.severity && d.severity !== options.severity) return false;
    if (options.line !== undefined && d.startLine !== options.line) return false;
    return true;
  });

  expect(matching.length).toBeGreaterThan(0);
}

/**
 * Assert no diagnostics are present
 */
export async function expectNoDiagnostics(page: Page): Promise<void> {
  const diagnostics = await getDiagnostics(page);
  expect(diagnostics).toHaveLength(0);
}

/**
 * Assert specific number of diagnostics
 */
export async function expectDiagnosticCount(page: Page, count: number): Promise<void> {
  const diagnostics = await getDiagnostics(page);
  expect(diagnostics).toHaveLength(count);
}

/**
 * Navigate to a specific test case
 */
export async function navigateToTestCase(
  page: Page,
  framework: string,
  category: string,
  name: string,
): Promise<void> {
  await page.goto(`/${framework}/${category}/${name}`);
  await waitForEditorReady(page);
}

/**
 * Fetch all test cases from the backend
 */
export async function getAllTestCases(request: APIRequestContext): Promise<Array<{
  framework: string;
  category: string;
  name: string;
  path: string;
}>> {
  const res = await request.get(`/api/test-cases`);
  return res.json();
}
