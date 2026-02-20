import fs from 'fs';
import os from 'os';
import path from 'path';

import { CssAutoDetector } from './CssAutoDetector';

describe('CssAutoDetector', () => {
	let detector: CssAutoDetector;
	let tempDir: string;

	beforeEach(() => {
		detector = new CssAutoDetector();
		tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'css-autodetect-'));
	});

	afterEach(() => {
		fs.rmSync(tempDir, { recursive: true, force: true });
	});

	function createFile(relativePath: string, content: string): string {
		const fullPath = path.join(tempDir, relativePath);
		fs.mkdirSync(path.dirname(fullPath), { recursive: true });
		fs.writeFileSync(fullPath, content);
		return fullPath;
	}

	function createDir(relativePath: string): string {
		const fullPath = path.join(tempDir, relativePath);
		fs.mkdirSync(fullPath, { recursive: true });
		return fullPath;
	}

	describe('single file detection', () => {
		it('should find CSS file in project root', () => {
			const cssPath = createFile('globals.css', '@import "tailwindcss";');
			const result = detector.detect(tempDir);

			expect(result.status).toBe('found');
			expect(result.cssFilePath).toBe(cssPath);
			expect(result.matchingFiles).toEqual([cssPath]);
		});

		it('should find CSS file in src/ subdirectory', () => {
			const cssPath = createFile('src/globals.css', '@import "tailwindcss";');
			const result = detector.detect(tempDir);

			expect(result.status).toBe('found');
			expect(result.cssFilePath).toBe(cssPath);
		});

		it('should find CSS file in deeply nested directory', () => {
			const cssPath = createFile('src/styles/base/globals.css', '@import "tailwindcss";');
			const result = detector.detect(tempDir);

			expect(result.status).toBe('found');
			expect(result.cssFilePath).toBe(cssPath);
		});
	});

	describe('import syntax variations', () => {
		it('should match double quotes: @import "tailwindcss"', () => {
			createFile('style.css', '@import "tailwindcss";');
			const result = detector.detect(tempDir);
			expect(result.status).toBe('found');
		});

		it("should match single quotes: @import 'tailwindcss'", () => {
			createFile('style.css', "@import 'tailwindcss';");
			const result = detector.detect(tempDir);
			expect(result.status).toBe('found');
		});

		it('should match without semicolon: @import "tailwindcss"', () => {
			createFile('style.css', '@import "tailwindcss"');
			const result = detector.detect(tempDir);
			expect(result.status).toBe('found');
		});

		it('should match subpath: @import "tailwindcss/theme"', () => {
			createFile('style.css', '@import "tailwindcss/theme";');
			const result = detector.detect(tempDir);
			expect(result.status).toBe('found');
		});

		it('should match subpath: @import "tailwindcss/preflight"', () => {
			createFile('style.css', '@import "tailwindcss/preflight";');
			const result = detector.detect(tempDir);
			expect(result.status).toBe('found');
		});

		it('should match subpath with single quotes', () => {
			createFile('style.css', "@import 'tailwindcss/theme';");
			const result = detector.detect(tempDir);
			expect(result.status).toBe('found');
		});

		it('should match with extra whitespace after @import', () => {
			createFile('style.css', '@import   "tailwindcss";');
			const result = detector.detect(tempDir);
			expect(result.status).toBe('found');
		});

		it('should match import preceded by comments and blank lines', () => {
			createFile(
				'style.css',
				`/* My stylesheet */

@import "tailwindcss";
`
			);
			const result = detector.detect(tempDir);
			expect(result.status).toBe('found');
		});
	});

	describe('files that should NOT match', () => {
		it('should not match CSS importing tailwindcss-animate (different package)', () => {
			createFile('style.css', '@import "tailwindcss-animate";');
			const result = detector.detect(tempDir);
			expect(result.status).toBe('not-found');
		});

		it('should not match CSS without any Tailwind import', () => {
			createFile('style.css', 'body { margin: 0; }');
			const result = detector.detect(tempDir);
			expect(result.status).toBe('not-found');
		});

		it('should not match non-CSS files containing the import text', () => {
			createFile('config.js', 'const css = \'@import "tailwindcss";\';');
			createFile('style.scss', '@import "tailwindcss";');
			createFile('data.json', '{"import": "@import \\"tailwindcss\\""}');
			const result = detector.detect(tempDir);
			expect(result.status).toBe('not-found');
		});
	});

	describe('directory skipping', () => {
		const skippedDirs = [
			'node_modules',
			'dist',
			'.git',
			'build',
			'out',
			'.next',
			'.nuxt',
			'.output',
			'coverage',
			'.cache'
		];

		it.each(skippedDirs)('should skip %s directory', dirName => {
			createFile(`${dirName}/style.css`, '@import "tailwindcss";');
			const result = detector.detect(tempDir);
			expect(result.status).toBe('not-found');
		});

		it('should find files in non-skipped directories alongside skipped ones', () => {
			createFile('node_modules/style.css', '@import "tailwindcss";');
			createFile('dist/style.css', '@import "tailwindcss";');
			const cssPath = createFile('src/globals.css', '@import "tailwindcss";');

			const result = detector.detect(tempDir);
			expect(result.status).toBe('found');
			expect(result.cssFilePath).toBe(cssPath);
		});
	});

	describe('multiple matches', () => {
		it('should return multiple-found when two CSS files match', () => {
			createFile('src/globals.css', '@import "tailwindcss";');
			createFile('packages/app/style.css', '@import "tailwindcss";');

			const result = detector.detect(tempDir);
			expect(result.status).toBe('multiple-found');
			expect(result.cssFilePath).toBeUndefined();
		});

		it('should list all matching files', () => {
			const file1 = createFile('src/globals.css', '@import "tailwindcss";');
			const file2 = createFile('packages/app/style.css', '@import "tailwindcss";');

			const result = detector.detect(tempDir);
			expect(result.matchingFiles).toHaveLength(2);
			expect(result.matchingFiles).toContain(file1);
			expect(result.matchingFiles).toContain(file2);
		});

		it('should only count CSS files with Tailwind import, not all CSS files', () => {
			createFile('src/globals.css', '@import "tailwindcss";');
			createFile('src/reset.css', 'body { margin: 0; }');
			createFile('src/utils.css', '.hidden { display: none; }');

			const result = detector.detect(tempDir);
			expect(result.status).toBe('found');
			expect(result.matchingFiles).toHaveLength(1);
		});
	});

	describe('no matches', () => {
		it('should return not-found when no CSS files exist', () => {
			createFile('index.ts', 'export default {}');
			const result = detector.detect(tempDir);
			expect(result.status).toBe('not-found');
			expect(result.matchingFiles).toEqual([]);
		});

		it('should return not-found for empty project directory', () => {
			const result = detector.detect(tempDir);
			expect(result.status).toBe('not-found');
			expect(result.matchingFiles).toEqual([]);
		});

		it('should return not-found with only empty subdirectories', () => {
			createDir('src');
			createDir('lib');
			const result = detector.detect(tempDir);
			expect(result.status).toBe('not-found');
		});
	});

	describe('depth limit', () => {
		it('should find files at depth 5', () => {
			// depth 0 = project root, depth 5 = 5 levels deep
			const cssPath = createFile('a/b/c/d/e/style.css', '@import "tailwindcss";');
			const result = detector.detect(tempDir);
			expect(result.status).toBe('found');
			expect(result.cssFilePath).toBe(cssPath);
		});

		it('should NOT find files at depth 6', () => {
			createFile('a/b/c/d/e/f/style.css', '@import "tailwindcss";');
			const result = detector.detect(tempDir);
			expect(result.status).toBe('not-found');
		});
	});

	describe('error handling', () => {
		it('should return not-found for non-existent project root', () => {
			const result = detector.detect('/non/existent/path');
			expect(result.status).toBe('not-found');
			expect(result.matchingFiles).toEqual([]);
		});

		it('should still find valid files when some directories are unreadable', () => {
			const cssPath = createFile('src/globals.css', '@import "tailwindcss";');
			const unreadableDir = createDir('restricted');

			try {
				fs.chmodSync(unreadableDir, 0o000);
				const result = detector.detect(tempDir);
				expect(result.status).toBe('found');
				expect(result.cssFilePath).toBe(cssPath);
			} finally {
				// Restore permissions for cleanup
				fs.chmodSync(unreadableDir, 0o755);
			}
		});
	});
});
