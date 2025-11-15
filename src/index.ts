import type * as ts from 'typescript/lib/tsserverlibrary';
import fs from 'fs';
import path from 'path';

import { LanguageServiceLogger } from './utils/Loger';

function init() {
	function create(info: ts.server.PluginCreateInfo) {
		const logger = new LanguageServiceLogger(info);

		logger.log('============= Plugin Starting =============');

		if (info.config && info.config.globalCss) {
			const projectRoot = info.project.getCurrentDirectory();
			const relativeCssPath = info.config.globalCss;
			const absoluteCssPath = path.resolve(projectRoot, relativeCssPath);

			// Check if CSS file exists
			if (fs.existsSync(absoluteCssPath)) {
				logger.log(`CSS file found, initializing Tailwind validator...`);
			} else {
				logger.log(`CSS file not found at: ${absoluteCssPath}`);
			}
		}

		// Set up decorator object
		const proxy: ts.LanguageService = Object.create(null);
		for (const k of Object.keys(info.languageService) as Array<keyof ts.LanguageService>) {
			const x = info.languageService[k]!;
			// @ts-ignore
			proxy[k] = (...args: Array<unknown>) => x.apply(info.languageService, args);
		}

		return proxy;
	}

	return { create };
}

export = init;
