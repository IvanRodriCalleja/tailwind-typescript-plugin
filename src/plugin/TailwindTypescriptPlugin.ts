import * as ts from 'typescript/lib/tsserverlibrary';
import fs from 'fs';
import path from 'path';

import { TailwindValidator } from '../infrastructure/TailwindValidator';
import { ClassNameExtractionService } from '../services/ClassNameExtractionService';
import { CodeActionService } from '../services/CodeActionService';
import { DiagnosticService } from '../services/DiagnosticService';
import { FileDiagnosticCache } from '../services/FileDiagnosticCache';
import { PluginConfigService } from '../services/PluginConfigService';
import { ValidationService } from '../services/ValidationService';
import { Logger, LoggerImpl, NoOpLogger } from '../utils/Logger';

export class TailwindTypescriptPlugin {
	private logger!: Logger;
	private validator!: TailwindValidator;
	private validationService!: ValidationService;
	private configService!: PluginConfigService;
	private diagnosticCache!: FileDiagnosticCache;
	private codeActionService!: CodeActionService;
	private initializationPromise: Promise<void> | null = null;

	constructor(private readonly typescript: typeof ts) {}

	/**
	 * Create the plugin proxy for TypeScript Language Service
	 */
	create(info: ts.server.PluginCreateInfo): ts.LanguageService {
		// PERFORMANCE: Use NoOpLogger by default, only enable if configured
		const enableLogging = (info.config || {}).enableLogging === true;
		this.logger = enableLogging ? new LoggerImpl(info, true) : new NoOpLogger();
		this.logger.log('============= Plugin Starting =============');

		// Initialize configuration service
		this.configService = new PluginConfigService(info.config || {}, this.logger);

		// PERFORMANCE: Initialize file-level diagnostic cache
		this.diagnosticCache = new FileDiagnosticCache(100);

		// Initialize validator if CSS file is configured
		this.initializeValidator(info);

		// Create language service proxy
		return this.createLanguageServiceProxy(info);
	}

	/**
	 * Initialize the Tailwind validator
	 */
	private initializeValidator(info: ts.server.PluginCreateInfo): void {
		if (!this.configService.hasValidCssPath()) {
			this.logger.log('No CSS file configured');
			return;
		}

		const projectRoot = info.project.getCurrentDirectory();
		const relativeCssPath = this.configService.getCssFilePath()!;
		const absoluteCssPath = path.resolve(projectRoot, relativeCssPath);

		if (!fs.existsSync(absoluteCssPath)) {
			this.logger.log(`CSS file not found at: ${absoluteCssPath}`);
			return;
		}

		this.logger.log(`CSS file found, initializing Tailwind validator...`);
		this.validator = new TailwindValidator(absoluteCssPath, this.logger);

		// Initialize services with config flags
		const extractionService = new ClassNameExtractionService(
			this.configService.isTailwindVariantsEnabled(),
			this.configService.isClassVarianceAuthorityEnabled()
		);
		const diagnosticService = new DiagnosticService();
		this.validationService = new ValidationService(
			extractionService,
			diagnosticService,
			this.validator,
			this.logger
		);

		// Initialize code action service for quick fixes
		this.codeActionService = new CodeActionService(this.validator);

		// Set allowed classes from config
		const allowedClasses = this.configService.getAllowedClasses();
		if (allowedClasses.length > 0) {
			this.validator.setAllowedClasses(allowedClasses);
		}

		// Start async initialization
		this.initializationPromise = this.validator
			.initialize()
			.then(() => {
				this.logger.log('Tailwind validator initialized');
			})
			.catch(error => {
				this.logger.log(`Failed to initialize Tailwind validator: ${error}`);
			});
	}

	/**
	 * Create a proxy for the TypeScript Language Service
	 * Intercepts semantic diagnostics to add Tailwind validation
	 */
	private createLanguageServiceProxy(info: ts.server.PluginCreateInfo): ts.LanguageService {
		const proxy: ts.LanguageService = Object.create(null);

		// Proxy all language service methods
		for (const k of Object.keys(info.languageService) as Array<keyof ts.LanguageService>) {
			const x = info.languageService[k]!;
			// @ts-ignore - Dynamic proxy creation
			proxy[k] = (...args: Array<unknown>) => x.apply(info.languageService, args);
		}

		// Override getSemanticDiagnostics to add Tailwind validation
		proxy.getSemanticDiagnostics = this.createGetSemanticDiagnostics(info);

		// Override getCodeFixesAtPosition to provide quick fixes for Tailwind errors
		proxy.getCodeFixesAtPosition = this.createGetCodeFixesAtPosition(info);

		// Override getSupportedCodeFixes to register our code fix
		const originalGetSupportedCodeFixes = info.languageService.getSupportedCodeFixes?.bind(
			info.languageService
		);
		if (originalGetSupportedCodeFixes) {
			proxy.getSupportedCodeFixes = () => {
				const original = originalGetSupportedCodeFixes();
				if (this.codeActionService) {
					const tailwindCodes = this.codeActionService
						.getSupportedErrorCodes()
						.map(code => String(code));
					return [...original, ...tailwindCodes];
				}
				return original;
			};
		}

		// Override getApplicableRefactors to provide quick fixes as refactors
		// This is an alternative way to provide code actions that works better in some IDEs
		proxy.getApplicableRefactors = this.createGetApplicableRefactors(info);

		// Override getEditsForRefactor to handle our refactors
		proxy.getEditsForRefactor = this.createGetEditsForRefactor(info);

		return proxy;
	}

	/**
	 * Create the getSemanticDiagnostics method with Tailwind validation
	 * PERFORMANCE OPTIMIZED with file-level caching
	 */
	private createGetSemanticDiagnostics =
		(info: ts.server.PluginCreateInfo) =>
		(fileName: string): ts.Diagnostic[] => {
			this.logger.log(`[getSemanticDiagnostics] Getting semantic diagnostics for ${fileName}`);

			// Get original TypeScript diagnostics
			const prior = info.languageService.getSemanticDiagnostics(fileName);

			// Skip if validator not initialized or not a JSX/TSX file
			if (!this.shouldValidateFile(fileName)) {
				return prior;
			}

			// Get source file and validate
			const program = info.languageService.getProgram()!;
			const sourceFile = program.getSourceFile(fileName);

			if (!sourceFile) {
				return prior;
			}

			// PERFORMANCE: Check file-level cache first
			const fileContent = sourceFile.getFullText();
			const cachedDiagnostics = this.diagnosticCache.get(fileName, fileContent);

			if (cachedDiagnostics !== undefined) {
				this.logger.log(`[CACHE HIT] Returning cached diagnostics for ${fileName}`);
				return [...prior, ...cachedDiagnostics];
			}

			this.logger.log(`[CACHE MISS] Validating ${fileName}`);

			// Get fresh type checker from current program (always up-to-date)
			const typeChecker = program.getTypeChecker();

			// Validate and get diagnostics
			const tailwindDiagnostics = this.validationService.validateFile(
				this.typescript,
				sourceFile,
				this.configService.getUtilityFunctions(),
				typeChecker
			);

			// PERFORMANCE: Cache the result
			this.diagnosticCache.set(fileName, fileContent, tailwindDiagnostics);

			return [...prior, ...tailwindDiagnostics];
		};

	/**
	 * Create the getCodeFixesAtPosition method with Tailwind quick fixes
	 */
	private createGetCodeFixesAtPosition =
		(info: ts.server.PluginCreateInfo) =>
		(
			fileName: string,
			start: number,
			end: number,
			errorCodes: readonly number[],
			formatOptions: ts.FormatCodeSettings,
			preferences: ts.UserPreferences
		): readonly ts.CodeFixAction[] => {
			this.logger.log(
				`[getCodeFixesAtPosition] fileName=${fileName}, start=${start}, end=${end}, errorCodes=${errorCodes.join(',')}`
			);

			// Get original TypeScript code fixes
			const prior = info.languageService.getCodeFixesAtPosition(
				fileName,
				start,
				end,
				errorCodes,
				formatOptions,
				preferences
			);

			// Skip if code action service not initialized or not a supported file
			if (!this.codeActionService || !this.shouldValidateFile(fileName)) {
				this.logger.log(
					'[getCodeFixesAtPosition] Skipping - service not initialized or unsupported file'
				);
				return prior;
			}

			// Check if any of our error codes are requested
			const supportedCodes = this.codeActionService.getSupportedErrorCodes();
			const hasOurErrorCode = errorCodes.some(code => supportedCodes.includes(code));

			if (!hasOurErrorCode) {
				this.logger.log(
					`[getCodeFixesAtPosition] No matching error codes. Requested: ${errorCodes.join(',')}, Supported: ${supportedCodes.join(',')}`
				);
				// Still try to provide fixes - the error code check might not be necessary for all IDEs
			}

			// Get source file
			const program = info.languageService.getProgram();
			if (!program) {
				return prior;
			}

			const sourceFile = program.getSourceFile(fileName);
			if (!sourceFile) {
				return prior;
			}

			// Get all diagnostics for this file (including cached Tailwind diagnostics)
			const allDiagnostics = this.diagnosticCache.get(fileName, sourceFile.getFullText()) || [];
			this.logger.log(`[getCodeFixesAtPosition] Found ${allDiagnostics.length} cached diagnostics`);

			// Get Tailwind quick fixes
			const tailwindFixes = this.codeActionService.getCodeActions(
				this.typescript,
				fileName,
				start,
				end,
				allDiagnostics,
				sourceFile
			);

			this.logger.log(`[getCodeFixesAtPosition] Generated ${tailwindFixes.length} Tailwind fixes`);

			return [...prior, ...tailwindFixes];
		};

	/**
	 * Determine if a file should be validated
	 */
	private shouldValidateFile(fileName: string): boolean {
		if (!this.validator || !this.validator.isInitialized()) {
			this.logger.log(`[shouldValidateFile] Validator not initialized yet for ${fileName}`);
			return false;
		}

		// Process .ts, .tsx, .js, and .jsx files
		const isSupportedFile =
			fileName.endsWith('.ts') ||
			fileName.endsWith('.tsx') ||
			fileName.endsWith('.js') ||
			fileName.endsWith('.jsx');
		if (!isSupportedFile) {
			return false;
		}

		return true;
	}

	/**
	 * Get the initialization promise (for testing)
	 */
	getInitializationPromise(): Promise<void> | null {
		return this.initializationPromise;
	}

	/**
	 * Create the getApplicableRefactors method for Tailwind quick fixes
	 * Refactors appear in the lightbulb menu alongside code fixes
	 */
	private createGetApplicableRefactors =
		(info: ts.server.PluginCreateInfo) =>
		(
			fileName: string,
			positionOrRange: number | ts.TextRange,
			preferences: ts.UserPreferences | undefined,
			triggerReason?: ts.RefactorTriggerReason
		): ts.ApplicableRefactorInfo[] => {
			const prior = info.languageService.getApplicableRefactors(
				fileName,
				positionOrRange,
				preferences,
				triggerReason
			);

			// Skip if not initialized or not a supported file
			if (!this.codeActionService || !this.shouldValidateFile(fileName)) {
				return prior;
			}

			const program = info.languageService.getProgram();
			if (!program) {
				return prior;
			}

			const sourceFile = program.getSourceFile(fileName);
			if (!sourceFile) {
				return prior;
			}

			// Get position range
			const start = typeof positionOrRange === 'number' ? positionOrRange : positionOrRange.pos;
			const end = typeof positionOrRange === 'number' ? positionOrRange : positionOrRange.end;

			// Get cached diagnostics
			const allDiagnostics = this.diagnosticCache.get(fileName, sourceFile.getFullText()) || [];

			// Find Tailwind diagnostics at this position
			const tailwindDiagnostics = allDiagnostics.filter(
				d =>
					(d as { source?: string }).source === 'tw-plugin' &&
					d.start !== undefined &&
					d.length !== undefined &&
					d.start <= end &&
					d.start + d.length >= start
			);

			if (tailwindDiagnostics.length === 0) {
				return prior;
			}

			// Create refactor info for each diagnostic
			const refactors: ts.ApplicableRefactorInfo[] = [];

			for (const diagnostic of tailwindDiagnostics) {
				if (diagnostic.start === undefined || diagnostic.length === undefined) {
					continue;
				}

				const invalidClass = sourceFile.text.substring(
					diagnostic.start,
					diagnostic.start + diagnostic.length
				);

				const actions: ts.RefactorActionInfo[] = [
					{
						name: `remove_${diagnostic.start}`,
						description: `Remove invalid class '${invalidClass}'`,
						kind: 'refactor.rewrite.tailwind.remove'
					}
				];

				// Add suggestions
				const suggestions = this.validator.getSimilarClasses(invalidClass, 3);
				for (const suggestion of suggestions) {
					actions.push({
						name: `replace_${diagnostic.start}_${suggestion}`,
						description: `Replace with '${suggestion}'`,
						kind: 'refactor.rewrite.tailwind.replace'
					});
				}

				refactors.push({
					name: 'tailwind-fix',
					description: 'Tailwind CSS Quick Fix',
					actions
				});
			}

			return [...prior, ...refactors];
		};

	/**
	 * Create the getEditsForRefactor method to handle Tailwind refactor actions
	 */
	private createGetEditsForRefactor =
		(info: ts.server.PluginCreateInfo) =>
		(
			fileName: string,
			formatOptions: ts.FormatCodeSettings,
			positionOrRange: number | ts.TextRange,
			refactorName: string,
			actionName: string,
			preferences: ts.UserPreferences | undefined
		): ts.RefactorEditInfo | undefined => {
			// Check if this is our refactor
			if (refactorName !== 'tailwind-fix') {
				return info.languageService.getEditsForRefactor(
					fileName,
					formatOptions,
					positionOrRange,
					refactorName,
					actionName,
					preferences
				);
			}

			const program = info.languageService.getProgram();
			if (!program) {
				return undefined;
			}

			const sourceFile = program.getSourceFile(fileName);
			if (!sourceFile) {
				return undefined;
			}

			// Parse action name to get the operation
			if (actionName.startsWith('remove_')) {
				const startPos = parseInt(actionName.replace('remove_', ''), 10);
				const allDiagnostics = this.diagnosticCache.get(fileName, sourceFile.getFullText()) || [];
				const diagnostic = allDiagnostics.find(d => d.start === startPos);

				if (diagnostic && diagnostic.length !== undefined) {
					return {
						edits: [
							{
								fileName,
								textChanges: [
									{
										span: { start: startPos, length: diagnostic.length },
										newText: ''
									}
								]
							}
						]
					};
				}
			} else if (actionName.startsWith('replace_')) {
				const parts = actionName.split('_');
				const startPos = parseInt(parts[1], 10);
				const replacement = parts.slice(2).join('_');

				const allDiagnostics = this.diagnosticCache.get(fileName, sourceFile.getFullText()) || [];
				const diagnostic = allDiagnostics.find(d => d.start === startPos);

				if (diagnostic && diagnostic.length !== undefined) {
					return {
						edits: [
							{
								fileName,
								textChanges: [
									{
										span: { start: startPos, length: diagnostic.length },
										newText: replacement
									}
								]
							}
						]
					};
				}
			}

			return undefined;
		};
}
