import * as ts from 'typescript/lib/tsserverlibrary';

import { FileDiagnosticCache } from './FileDiagnosticCache';

describe('FileDiagnosticCache', () => {
	let cache: FileDiagnosticCache;

	// Helper to create a mock diagnostic
	const createMockDiagnostic = (code: number): ts.Diagnostic => ({
		file: undefined,
		start: 0,
		length: 10,
		messageText: `Test diagnostic ${code}`,
		category: ts.DiagnosticCategory.Error,
		code
	});

	beforeEach(() => {
		cache = new FileDiagnosticCache(3); // Small cache for testing LRU
	});

	describe('basic operations', () => {
		it('should return undefined for uncached files', () => {
			const result = cache.get('uncached.ts', 'content');
			expect(result).toBeUndefined();
		});

		it('should cache and retrieve diagnostics', () => {
			const diagnostics = [createMockDiagnostic(1)];
			cache.set('file.ts', 'content', diagnostics);

			const result = cache.get('file.ts', 'content');
			expect(result).toEqual(diagnostics);
		});

		it('should return undefined when content changes', () => {
			const diagnostics = [createMockDiagnostic(1)];
			cache.set('file.ts', 'original content', diagnostics);

			const result = cache.get('file.ts', 'modified content');
			expect(result).toBeUndefined();
		});

		it('should update cache when content changes', () => {
			const oldDiagnostics = [createMockDiagnostic(1)];
			const newDiagnostics = [createMockDiagnostic(2)];

			cache.set('file.ts', 'old content', oldDiagnostics);
			cache.set('file.ts', 'new content', newDiagnostics);

			expect(cache.get('file.ts', 'old content')).toBeUndefined();
			expect(cache.get('file.ts', 'new content')).toEqual(newDiagnostics);
		});

		it('should cache empty diagnostics array', () => {
			cache.set('file.ts', 'content', []);

			const result = cache.get('file.ts', 'content');
			expect(result).toEqual([]);
		});

		it('should handle multiple files independently', () => {
			const diag1 = [createMockDiagnostic(1)];
			const diag2 = [createMockDiagnostic(2)];

			cache.set('file1.ts', 'content1', diag1);
			cache.set('file2.ts', 'content2', diag2);

			expect(cache.get('file1.ts', 'content1')).toEqual(diag1);
			expect(cache.get('file2.ts', 'content2')).toEqual(diag2);
		});
	});

	describe('LRU eviction', () => {
		it('should evict oldest entry when cache is full', () => {
			cache.set('file1.ts', 'content1', [createMockDiagnostic(1)]);
			cache.set('file2.ts', 'content2', [createMockDiagnostic(2)]);
			cache.set('file3.ts', 'content3', [createMockDiagnostic(3)]);

			// Cache is now full (maxSize = 3)
			// Adding a 4th entry should evict file1
			cache.set('file4.ts', 'content4', [createMockDiagnostic(4)]);

			expect(cache.get('file1.ts', 'content1')).toBeUndefined();
			expect(cache.get('file2.ts', 'content2')).toBeDefined();
			expect(cache.get('file3.ts', 'content3')).toBeDefined();
			expect(cache.get('file4.ts', 'content4')).toBeDefined();
		});

		it('should move accessed entries to end (most recently used)', () => {
			cache.set('file1.ts', 'content1', [createMockDiagnostic(1)]);
			cache.set('file2.ts', 'content2', [createMockDiagnostic(2)]);
			cache.set('file3.ts', 'content3', [createMockDiagnostic(3)]);

			// Access file1 to make it most recently used
			cache.get('file1.ts', 'content1');

			// Add file4 - should evict file2 (oldest after file1 was accessed)
			cache.set('file4.ts', 'content4', [createMockDiagnostic(4)]);

			expect(cache.get('file1.ts', 'content1')).toBeDefined();
			expect(cache.get('file2.ts', 'content2')).toBeUndefined();
			expect(cache.get('file3.ts', 'content3')).toBeDefined();
			expect(cache.get('file4.ts', 'content4')).toBeDefined();
		});
	});

	describe('invalidate', () => {
		it('should remove specific file from cache', () => {
			cache.set('file1.ts', 'content1', [createMockDiagnostic(1)]);
			cache.set('file2.ts', 'content2', [createMockDiagnostic(2)]);

			cache.invalidate('file1.ts');

			expect(cache.get('file1.ts', 'content1')).toBeUndefined();
			expect(cache.get('file2.ts', 'content2')).toBeDefined();
		});

		it('should handle invalidating non-existent file', () => {
			expect(() => cache.invalidate('nonexistent.ts')).not.toThrow();
		});
	});

	describe('clear', () => {
		it('should remove all entries from cache', () => {
			cache.set('file1.ts', 'content1', [createMockDiagnostic(1)]);
			cache.set('file2.ts', 'content2', [createMockDiagnostic(2)]);

			cache.clear();

			expect(cache.get('file1.ts', 'content1')).toBeUndefined();
			expect(cache.get('file2.ts', 'content2')).toBeUndefined();
		});

		it('should reset cache size to 0', () => {
			cache.set('file1.ts', 'content1', [createMockDiagnostic(1)]);
			cache.clear();

			expect(cache.getStats().size).toBe(0);
		});
	});

	describe('getStats', () => {
		it('should return correct size and maxSize', () => {
			expect(cache.getStats()).toEqual({ size: 0, maxSize: 3 });

			cache.set('file1.ts', 'content1', [createMockDiagnostic(1)]);
			expect(cache.getStats()).toEqual({ size: 1, maxSize: 3 });

			cache.set('file2.ts', 'content2', [createMockDiagnostic(2)]);
			expect(cache.getStats()).toEqual({ size: 2, maxSize: 3 });
		});

		it('should not exceed maxSize', () => {
			for (let i = 0; i < 10; i++) {
				cache.set(`file${i}.ts`, `content${i}`, [createMockDiagnostic(i)]);
			}

			expect(cache.getStats().size).toBe(3);
		});
	});

	describe('content hashing', () => {
		it('should treat identical content as cache hit', () => {
			const diagnostics = [createMockDiagnostic(1)];
			cache.set('file.ts', 'identical content', diagnostics);

			const result = cache.get('file.ts', 'identical content');
			expect(result).toEqual(diagnostics);
		});

		it('should detect whitespace changes', () => {
			const diagnostics = [createMockDiagnostic(1)];
			cache.set('file.ts', 'content with spaces', diagnostics);

			expect(cache.get('file.ts', 'content  with  spaces')).toBeUndefined();
		});

		it('should detect case changes', () => {
			const diagnostics = [createMockDiagnostic(1)];
			cache.set('file.ts', 'Content', diagnostics);

			expect(cache.get('file.ts', 'content')).toBeUndefined();
		});
	});

	describe('edge cases', () => {
		it('should handle empty content', () => {
			const diagnostics = [createMockDiagnostic(1)];
			cache.set('file.ts', '', diagnostics);

			expect(cache.get('file.ts', '')).toEqual(diagnostics);
		});

		it('should handle very long content', () => {
			const longContent = 'x'.repeat(100000);
			const diagnostics = [createMockDiagnostic(1)];
			cache.set('file.ts', longContent, diagnostics);

			expect(cache.get('file.ts', longContent)).toEqual(diagnostics);
		});

		it('should handle unicode content', () => {
			const unicodeContent = 'const 变量 = "日本語"; // 中文注释';
			const diagnostics = [createMockDiagnostic(1)];
			cache.set('file.ts', unicodeContent, diagnostics);

			expect(cache.get('file.ts', unicodeContent)).toEqual(diagnostics);
		});

		it('should handle special characters in file names', () => {
			const diagnostics = [createMockDiagnostic(1)];
			cache.set('/path/to/file with spaces.ts', 'content', diagnostics);

			expect(cache.get('/path/to/file with spaces.ts', 'content')).toEqual(diagnostics);
		});

		it('should handle cache size of 1', () => {
			const smallCache = new FileDiagnosticCache(1);
			smallCache.set('file1.ts', 'content1', [createMockDiagnostic(1)]);
			smallCache.set('file2.ts', 'content2', [createMockDiagnostic(2)]);

			expect(smallCache.get('file1.ts', 'content1')).toBeUndefined();
			expect(smallCache.get('file2.ts', 'content2')).toBeDefined();
		});

		it('should use default maxSize when not specified', () => {
			const defaultCache = new FileDiagnosticCache();
			expect(defaultCache.getStats().maxSize).toBe(100);
		});
	});
});
