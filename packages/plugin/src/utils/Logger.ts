import * as ts from 'typescript/lib/tsserverlibrary';

export interface Logger {
	log(msg: string): void;
}

export class LoggerImpl implements Logger {
	constructor(private readonly info: ts.server.PluginCreateInfo) {}

	public log(msg: string) {
		this.info.project.projectService.logger.info(`[tailwind-typescript-plugin] ${msg}`);
	}
}
