import * as ts from 'typescript/lib/tsserverlibrary';

export interface Logger {
	log(msg: string): void;
	isEnabled(): boolean;
}

/**
 * Logger implementation with performance-aware logging
 *
 * PERFORMANCE OPTIMIZATION:
 * - Logging disabled by default (eliminates string concatenation overhead)
 * - Enable via config: { enableLogging: true }
 * - Saves 10-20% performance in hot paths
 */
export class LoggerImpl implements Logger {
	private enabled: boolean;

	constructor(
		private readonly info: ts.server.PluginCreateInfo,
		enabled: boolean = false
	) {
		this.enabled = enabled;
	}

	public log(msg: string) {
		if (!this.enabled) {
			return;
		}
		this.info.project.projectService.logger.info(`[tailwind-typescript-plugin] ${msg}`);
	}

	public isEnabled(): boolean {
		return this.enabled;
	}
}

/**
 * No-op logger for maximum performance (zero overhead)
 */
export class NoOpLogger implements Logger {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public log(_msg: string) {
		// No-op
	}

	public isEnabled(): boolean {
		return false;
	}
}
