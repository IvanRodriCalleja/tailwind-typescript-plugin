import path from 'path';
import { defineConfig } from 'vite';

import { tailwindPluginServer } from './src/server/vite-plugin';

export default defineConfig({
	root: 'src',
	build: {
		outDir: '../dist',
		emptyOutDir: true
	},
	resolve: {
		alias: {
			'tailwind-typescript-plugin': path.resolve(__dirname, '../lib')
		}
	},
	server: {
		port: 5173,
		strictPort: true
	},
	preview: {
		port: 5173,
		strictPort: true
	},
	optimizeDeps: {
		include: ['monaco-editor']
	},
	plugins: [tailwindPluginServer()]
});
