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

						// Handle JSX expression: className={'foo bar'}
						else if (typescript.isJsxExpression(initializer)) {
							const expression = initializer.expression;

							// Check if the expression is a string literal
							if (expression && typescript.isStringLiteral(expression)) {
								const fullText = expression.text;
								// Get the start position of the string content (after opening quote)
								const stringContentStart = expression.getStart() + 1;
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

							// Handle template literals: className={`flex ${someClass} invalid-class`}
							else if (expression && typescript.isTemplateExpression(expression)) {
								// Template expression has a head and template spans
								// Extract static parts only (skip interpolated ${} expressions)
								const parts: Array<{ text: string; start: number }> = [];

								// Add the head (the part before the first ${})
								// getStart() + 1 to skip the opening backtick
								parts.push({
									text: expression.head.text,
									start: expression.head.getStart() + 1
								});

								// Add each template span's literal part (the parts after each ${})
								expression.templateSpans.forEach(span => {
									// span.literal is either TemplateMiddle or TemplateTail
									// getStart() + 1 to skip the closing brace of ${}
									parts.push({
										text: span.literal.text,
										start: span.literal.getStart() + 1
									});
								});

								// Process each static part for class names
								parts.forEach(part => {
									let offset = 0;
									part.text.split(' ').forEach(className => {
										if (className) {
											classNames.push({
												className: className,
												absoluteStart: part.start + offset,
												length: className.length,
												line: lineNumber,
												file: sourceFile.fileName
											});
										}
										offset += className.length + 1;
									});
								});
							}

							// Handle no-substitution template literal: className={`flex items-center`}
							else if (expression && typescript.isNoSubstitutionTemplateLiteral(expression)) {
								const fullText = expression.text;
								// Get the start position of the string content (after opening backtick)
								const stringContentStart = expression.getStart() + 1;
								let offset = 0;

								// Split by spaces and track absolute position of each class
								fullText.split(' ').forEach(className => {
									if (className) {
										classNames.push({
											className: className,
											absoluteStart: stringContentStart + offset,
											length: className.length,
											line: lineNumber,
											file: sourceFile.fileName
										});
									}
									offset += className.length + 1;
								});
							}
						}
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
	// @ts-expect-error
	private logger: Logger;
	// @ts-expect-error
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
			this.logger.log(`[getSemanticDiagnostics] Getting semantic diagnostics for ${fileName}`);
			const prior = info.languageService.getSemanticDiagnostics(fileName);

			if (!this.validator.isInitialized()) {
				this.logger.log(`[getSemanticDiagnostics] Validator not initialized yet for ${fileName}`);
				return prior;
			}

			// Only process .tsx and .jsx files for "className" prop
			if (fileName.endsWith('.tsx') || fileName.endsWith('.jsx')) {
				this.logger.log(`[getSemanticDiagnostics] Processing file: ${fileName}`);
				const program = info.languageService.getProgram()!;
				const sourceFile = program.getSourceFile(fileName);

				if (sourceFile) {
					const classNames = extractClassNames(this.typescript, sourceFile);
					this.logger.log(
						`[getSemanticDiagnostics] Found ${classNames.length} class names to validate`
					);

					// Validate each class and create diagnostics
					const newDiagnostics: ts.Diagnostic[] = [];

					for (const classInfo of classNames) {
						const { className, absoluteStart, length } = classInfo;

						// Validate the class name using the Tailwind validator
						const isValid = this.validator.isValidClass(className);
						this.logger.log(
							`[getSemanticDiagnostics] Validating "${className}": ${isValid ? 'VALID' : 'INVALID'}`
						);

						if (!isValid) {
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
						this.logger.log(
							`[getSemanticDiagnostics] Returning ${newDiagnostics.length} diagnostics`
						);
						return [...prior, ...newDiagnostics];
					} else {
						this.logger.log(`[getSemanticDiagnostics] No invalid classes found`);
					}
				}
			}

			return prior;
		};
}

// Export for TypeScript Language Service
export = (mod: { typescript: typeof ts }) => new TailwindTypescriptPlugin(mod.typescript);
