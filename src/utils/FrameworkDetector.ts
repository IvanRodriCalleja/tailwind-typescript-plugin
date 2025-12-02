/**
 * Supported frameworks for class name extraction
 */
export enum Framework {
	JSX = 'jsx',
	VUE = 'vue',
	SVELTE = 'svelte'
}

/**
 * Detects the framework based on file extension
 * Assumes pre-processors like @vue/language-tools are configured
 *
 * @param fileName - The file name or path
 * @returns The detected framework or null if not supported
 */
export function detectFramework(fileName: string): Framework | null {
	// Vue Single File Components
	if (fileName.endsWith('.vue')) {
		return Framework.VUE;
	}

	// Svelte components
	if (fileName.endsWith('.svelte')) {
		return Framework.SVELTE;
	}

	// JSX/TSX files (React, Solid, etc.)
	if (fileName.endsWith('.tsx') || fileName.endsWith('.jsx')) {
		return Framework.JSX;
	}

	// Plain TS/JS files might contain JSX if configured
	// We'll treat them as potential JSX files
	if (fileName.endsWith('.ts') || fileName.endsWith('.js')) {
		return Framework.JSX;
	}

	// Unsupported file type
	return null;
}

/**
 * Checks if a file should be validated based on its extension
 *
 * @param fileName - The file name or path
 * @returns True if the file should be validated
 */
export function isSupportedFile(fileName: string): boolean {
	return detectFramework(fileName) !== null;
}
