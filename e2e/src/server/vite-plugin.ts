/**
 * Vite plugin that provides API middleware for running the real TypeScript plugin.
 * Works in both dev (configureServer) and preview (configurePreviewServer) modes.
 */
import path from 'path';
import type { Connect, Plugin } from 'vite';

import { PluginBridge } from './plugin-bridge';

function parseJsonBody(req: Connect.IncomingMessage): Promise<Record<string, unknown>> {
	return new Promise((resolve, reject) => {
		let body = '';
		req.on('data', (chunk: Buffer) => {
			body += chunk.toString();
		});
		req.on('end', () => {
			try {
				resolve(body ? JSON.parse(body) : {});
			} catch (e) {
				reject(e);
			}
		});
		req.on('error', reject);
	});
}

function sendJson(res: Connect.ServerResponse, data: unknown, status = 200): void {
	res.writeHead(status, { 'Content-Type': 'application/json' });
	res.end(JSON.stringify(data));
}

function sendError(res: Connect.ServerResponse, message: string, status = 500): void {
	sendJson(res, { error: message }, status);
}

function registerApiMiddleware(middlewares: Connect.Server, bridge: PluginBridge): void {
	// API middleware
	middlewares.use(async (req, res, next) => {
		const url = req.url || '';

		// Only handle /api/ routes
		if (!url.startsWith('/api/')) {
			return next();
		}

		try {
			// GET /api/test-cases — list all test cases
			if (url === '/api/test-cases' && req.method === 'GET') {
				const testCases = bridge.listTestCases();
				return sendJson(res, testCases);
			}

			// GET /api/test-case/:framework/:category/:name
			const testCaseMatch = url.match(/^\/api\/test-case\/([^/]+)\/([^/]+)\/([^/]+)$/);
			if (testCaseMatch && req.method === 'GET') {
				const [, framework, category, name] = testCaseMatch;
				const info = bridge.getTestCaseInfo(framework, category, name);
				return sendJson(res, info);
			}

			// POST /api/diagnostics
			if (url === '/api/diagnostics' && req.method === 'POST') {
				const body = await parseJsonBody(req);
				const testCasePath = body.testCasePath as string;
				if (!testCasePath) {
					return sendError(res, 'testCasePath is required', 400);
				}
				const diagnostics = await bridge.getDiagnostics(testCasePath);
				return sendJson(res, diagnostics);
			}

			// POST /api/completions
			if (url === '/api/completions' && req.method === 'POST') {
				const body = await parseJsonBody(req);
				const testCasePath = body.testCasePath as string;
				const position = body.position as number;
				if (!testCasePath || position === undefined) {
					return sendError(res, 'testCasePath and position are required', 400);
				}
				const completions = await bridge.getCompletions(testCasePath, position);
				return sendJson(res, completions);
			}

			// POST /api/code-actions
			if (url === '/api/code-actions' && req.method === 'POST') {
				const body = await parseJsonBody(req);
				const testCasePath = body.testCasePath as string;
				const start = body.start as number;
				const end = body.end as number;
				const errorCodes = body.errorCodes as number[];
				if (!testCasePath || start === undefined || end === undefined || !errorCodes) {
					return sendError(res, 'testCasePath, start, end, and errorCodes are required', 400);
				}
				const actions = await bridge.getCodeActions(testCasePath, start, end, errorCodes);
				return sendJson(res, actions);
			}

			// POST /api/diagnostics/custom
			if (url === '/api/diagnostics/custom' && req.method === 'POST') {
				const body = await parseJsonBody(req);
				const code = body.code as string;
				const language = (body.language as 'tsx' | 'vue') || 'tsx';
				const config = (body.config as Record<string, unknown>) || {};
				if (!code) {
					return sendError(res, 'code is required', 400);
				}
				const diagnostics = await bridge.getDiagnosticsForCustomCode(code, language, config);
				return sendJson(res, diagnostics);
			}

			// Unknown API route
			return sendError(res, 'Not found', 404);
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			console.error('[tailwind-plugin-server]', message);
			return sendError(res, message);
		}
	});

	// SPA fallback: rewrite non-API, non-asset URLs to / for client-side routing
	middlewares.use((req, _res, next) => {
		const url = req.url || '';
		if (
			!url.startsWith('/api/') &&
			!url.startsWith('/@') &&
			!url.startsWith('/node_modules/') &&
			!url.includes('.') &&
			url !== '/'
		) {
			req.url = '/';
		}
		next();
	});
}

export function tailwindPluginServer(): Plugin {
	const exampleDir = path.resolve(__dirname, '../../../example');
	let bridge: PluginBridge;

	return {
		name: 'tailwind-plugin-server',
		configureServer(server) {
			bridge = new PluginBridge(exampleDir);
			registerApiMiddleware(server.middlewares, bridge);
		},
		configurePreviewServer(server) {
			if (!bridge) {
				bridge = new PluginBridge(exampleDir);
			}
			registerApiMiddleware(server.middlewares, bridge);
		}
	};
}
