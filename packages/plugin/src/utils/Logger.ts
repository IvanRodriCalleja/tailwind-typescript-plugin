import * as ts from 'typescript/lib/tsserverlibrary';

export class Logger {
	constructor(private readonly info: ts.server.PluginCreateInfo) {}

	public log(msg: string) {
		this.info.project.projectService.logger.info(`[tailwind-typescript-plugin] ${msg}`);
	}
}
