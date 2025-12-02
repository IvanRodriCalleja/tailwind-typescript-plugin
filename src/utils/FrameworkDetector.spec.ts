import { Framework, detectFramework, isSupportedFile } from './FrameworkDetector';

describe('FrameworkDetector', () => {
	describe('detectFramework', () => {
		it('should detect JSX framework for .tsx files', () => {
			expect(detectFramework('App.tsx')).toBe(Framework.JSX);
			expect(detectFramework('/src/components/Button.tsx')).toBe(Framework.JSX);
		});

		it('should detect JSX framework for .jsx files', () => {
			expect(detectFramework('App.jsx')).toBe(Framework.JSX);
			expect(detectFramework('/src/components/Button.jsx')).toBe(Framework.JSX);
		});

		it('should detect JSX framework for .ts files', () => {
			expect(detectFramework('utils.ts')).toBe(Framework.JSX);
			expect(detectFramework('/src/lib/helpers.ts')).toBe(Framework.JSX);
		});

		it('should detect JSX framework for .js files', () => {
			expect(detectFramework('utils.js')).toBe(Framework.JSX);
			expect(detectFramework('/src/lib/helpers.js')).toBe(Framework.JSX);
		});

		it('should detect Vue framework for .vue files', () => {
			expect(detectFramework('App.vue')).toBe(Framework.VUE);
			expect(detectFramework('/src/components/Button.vue')).toBe(Framework.VUE);
		});

		it('should detect Svelte framework for .svelte files', () => {
			expect(detectFramework('App.svelte')).toBe(Framework.SVELTE);
			expect(detectFramework('/src/components/Button.svelte')).toBe(Framework.SVELTE);
		});

		it('should return null for unsupported file types', () => {
			expect(detectFramework('styles.css')).toBeNull();
			expect(detectFramework('index.html')).toBeNull();
			expect(detectFramework('config.json')).toBeNull();
			expect(detectFramework('README.md')).toBeNull();
		});

		it('should handle files with multiple dots in name', () => {
			expect(detectFramework('Button.test.tsx')).toBe(Framework.JSX);
			expect(detectFramework('App.stories.tsx')).toBe(Framework.JSX);
			expect(detectFramework('Component.spec.vue')).toBe(Framework.VUE);
		});

		it('should handle absolute paths', () => {
			expect(detectFramework('/Users/dev/project/src/App.tsx')).toBe(Framework.JSX);
			expect(detectFramework('/Users/dev/project/src/App.vue')).toBe(Framework.VUE);
			expect(detectFramework('/Users/dev/project/src/App.svelte')).toBe(Framework.SVELTE);
		});

		it('should handle Windows paths', () => {
			expect(detectFramework('C:\\Users\\dev\\project\\src\\App.tsx')).toBe(Framework.JSX);
			expect(detectFramework('C:\\Users\\dev\\project\\src\\App.vue')).toBe(Framework.VUE);
		});
	});

	describe('isSupportedFile', () => {
		it('should return true for JSX files', () => {
			expect(isSupportedFile('App.tsx')).toBe(true);
			expect(isSupportedFile('App.jsx')).toBe(true);
			expect(isSupportedFile('utils.ts')).toBe(true);
			expect(isSupportedFile('utils.js')).toBe(true);
		});

		it('should return true for Vue files', () => {
			expect(isSupportedFile('App.vue')).toBe(true);
			expect(isSupportedFile('/src/components/Button.vue')).toBe(true);
		});

		it('should return true for Svelte files', () => {
			expect(isSupportedFile('App.svelte')).toBe(true);
			expect(isSupportedFile('/src/components/Button.svelte')).toBe(true);
		});

		it('should return false for unsupported files', () => {
			expect(isSupportedFile('styles.css')).toBe(false);
			expect(isSupportedFile('index.html')).toBe(false);
			expect(isSupportedFile('config.json')).toBe(false);
			expect(isSupportedFile('README.md')).toBe(false);
			expect(isSupportedFile('image.png')).toBe(false);
		});
	});
});
