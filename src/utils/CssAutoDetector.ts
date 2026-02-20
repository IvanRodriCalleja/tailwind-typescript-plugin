import fs from 'fs';
import path from 'path';

export interface CssAutoDetectResult {
	cssFilePath: string | undefined;
	status: 'found' | 'not-found' | 'multiple-found';
	matchingFiles: string[];
}

const SKIPPED_DIRECTORIES = new Set([
	'node_modules',
	'dist',
	'.git',
	'build',
	'out',
	'.next',
	'.nuxt',
	'.output',
	'.svelte-kit',
	'coverage',
	'.turbo',
	'.cache'
]);

const MAX_DEPTH = 5;

const TAILWIND_IMPORT_REGEX = /^@import\s+["']tailwindcss(?:\/[^"']*)?["'];?\s*$/m;

export class CssAutoDetector {
	detect(projectRoot: string): CssAutoDetectResult {
		const matchingFiles: string[] = [];

		try {
			this.scanDirectory(projectRoot, matchingFiles, 0);
		} catch {
			// Silently handle unreadable root directory
		}

		if (matchingFiles.length === 1) {
			return {
				cssFilePath: matchingFiles[0],
				status: 'found',
				matchingFiles
			};
		}

		if (matchingFiles.length > 1) {
			return {
				cssFilePath: undefined,
				status: 'multiple-found',
				matchingFiles
			};
		}

		return {
			cssFilePath: undefined,
			status: 'not-found',
			matchingFiles: []
		};
	}

	private scanDirectory(dirPath: string, matchingFiles: string[], depth: number): void {
		if (depth > MAX_DEPTH) {
			return;
		}

		let entries: fs.Dirent[];
		try {
			entries = fs.readdirSync(dirPath, { withFileTypes: true });
		} catch {
			return;
		}

		for (const entry of entries) {
			const fullPath = path.join(dirPath, entry.name);

			if (entry.isDirectory()) {
				if (!SKIPPED_DIRECTORIES.has(entry.name)) {
					this.scanDirectory(fullPath, matchingFiles, depth + 1);
				}
				continue;
			}

			if (!entry.isFile() || !entry.name.endsWith('.css')) {
				continue;
			}

			try {
				const fd = fs.openSync(fullPath, 'r');
				const buffer = Buffer.alloc(1024);
				const bytesRead = fs.readSync(fd, buffer, 0, 1024, 0);
				fs.closeSync(fd);

				const content = buffer.toString('utf-8', 0, bytesRead);
				if (TAILWIND_IMPORT_REGEX.test(content)) {
					matchingFiles.push(fullPath);
				}
			} catch {
				// Silently skip unreadable files
			}
		}
	}
}
