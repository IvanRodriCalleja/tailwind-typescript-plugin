import * as ts from 'typescript/lib/tsserverlibrary';
import fs from 'fs';
import path from 'path';

import { TailwindValidator } from './TailwindValidator';
import { Logger, LoggerImpl } from './utils/Logger';

const extractClassNames = (typescript: typeof ts, sourceFile: ts.SourceFile) => {
	const classNames: Array<{
		className: string;
		absoluteStart: number;
		length: number;
		line: number;
		file: string;
	}> = [];

	function visit(node: ts.Node): void {
		// Check for JSX opening elements (<div className="...">)
		if (typescript.isJsxOpeningElement(node) || typescript.isJsxSelfClosingElement(node)) {
			const attributes = node.attributes.properties;

			for (const attr of attributes) {
				if (typescript.isJsxAttribute(attr) && attr.name.getText() === 'className') {
					const initializer = attr.initializer;

					if (initializer) {
						const lineNumber = sourceFile.getLineAndCharacterOfPosition(attr.getStart()).line + 1;

						// Handle string literal: className="foo bar"
						if (typescript.isStringLiteral(initializer)) {
							const fullText = initializer.text;
							// Get the start position of the string content (after opening quote)
							const stringContentStart = initializer.getStart() + 1;
							let offset = 0;

							// Split by spaces and track absolute position of each class
							fullText.split(' ').forEach(className => {
								if (className) {
									// Skip empty strings from multiple spaces
									classNames.push({
										className: className,
										absoluteStart: stringContentStart + offset,
										length: className.length,
										line: lineNumber,
										file: sourceFile.fileName
									});
								}
								// Update offset for next class (class length + space)
								offset += className.length + 1;
							});
						}
						// Handle JSX expression: className={clsx(...)} or className={cn(...)}
					}
				}
			}
		}

		typescript.forEachChild(node, visit);
	}

	visit(sourceFile);
	return classNames;
};

class TailwindTypescriptPlugin {
	private logger: Logger;
	private validator: TailwindValidator;
	private initializationPromise: Promise<void> | null = null;

	constructor(private readonly typescript: typeof ts) {}

	create(info: ts.server.PluginCreateInfo) {
		this.logger = new LoggerImpl(info);

		this.logger.log('============= Plugin Starting =============');

		if (info.config && info.config.globalCss) {
			const projectRoot = info.project.getCurrentDirectory();
			const relativeCssPath = info.config.globalCss;
			const absoluteCssPath = path.resolve(projectRoot, relativeCssPath);

			// Check if CSS file exists
			if (fs.existsSync(absoluteCssPath)) {
				this.logger.log(`CSS file found, initializing Tailwind validator...`);

				this.validator = new TailwindValidator(absoluteCssPath, this.logger);
				this.initializationPromise = this.validator
					.initialize()
					.then(() => {
						this.logger.log('Tailwind validator initialized');
					})
					.catch(error => {
						this.logger.log(`Failed to initialize Tailwind validator: ${error}`);
					});
			} else {
				this.logger.log(`CSS file not found at: ${absoluteCssPath}`);
			}
		}

		// Set up decorator object
		const proxy: ts.LanguageService = Object.create(null);
		for (const k of Object.keys(info.languageService) as Array<keyof ts.LanguageService>) {
			const x = info.languageService[k]!;
			// @ts-ignore
			proxy[k] = (...args: Array<unknown>) => x.apply(info.languageService, args);
		}

		proxy.getSemanticDiagnostics = this.getSemanticDiagnostics(info);
		return proxy;
	}

	getInitializationPromise(): Promise<void> | null {
		return this.initializationPromise;
	}

	private getSemanticDiagnostics =
		(info: ts.server.PluginCreateInfo) =>
		(fileName: string): ts.Diagnostic[] => {
			const prior = info.languageService.getSemanticDiagnostics(fileName);

			if (!this.validator.isInitialized()) {
				return prior;
			}

			// Only process .tsx and .jsx files for "className" prop
			if (fileName.endsWith('.tsx') || fileName.endsWith('.jsx')) {
				const program = info.languageService.getProgram();
				const sourceFile = program.getSourceFile(fileName);

				if (sourceFile) {
					const classNames = extractClassNames(this.typescript, sourceFile);

					// Validate each class and create diagnostics
					const newDiagnostics: ts.Diagnostic[] = [];

					for (const classInfo of classNames) {
						const { className, absoluteStart, length } = classInfo;

						// Validate the class name using the Tailwind validator
						if (!this.validator.isValidClass(className)) {
							newDiagnostics.push({
								file: sourceFile,
								start: absoluteStart,
								length: length,
								messageText: `The class "${className}" is not a valid Tailwind class`,
								category: ts.DiagnosticCategory.Error,
								code: 9999,
								source: 'tw-plugin'
							});
						}
					}

					if (newDiagnostics.length > 0) {
						return [...prior, ...newDiagnostics];
					}
				}
			}

			return prior;
		};
}

// Export for TypeScript Language Service
export = (mod: { typescript: typeof ts }) => new TailwindTypescriptPlugin(mod.typescript);
