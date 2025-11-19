import * as ts from 'typescript/lib/tsserverlibrary';
import fs from 'fs';
import path from 'path';

const pluginDir = __dirname;
const debugLogPath = path.join(pluginDir, '../../debug.log');
export interface Logger {
	log(msg: string): void;
}

export class LoggerImpl implements Logger {
	constructor(private readonly info: ts.server.PluginCreateInfo) {
		// Clear the debug log on init
		try {
			fs.writeFileSync(debugLogPath, `=== Plugin Initialized ${new Date().toISOString()} ===\n`);
		} catch {
			// Ignore
		}
	}

	public log(message: string) {
		const timestamp = new Date().toISOString();
		const logMessage = `[${timestamp}] ${message}\n`;

		// Write to debug file
		try {
			fs.appendFileSync(debugLogPath, logMessage);
		} catch {
			// Ignore file write errors
		}
	}
}
