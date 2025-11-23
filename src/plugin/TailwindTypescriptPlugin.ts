import * as ts from 'typescript/lib/tsserverlibrary';
import fs from 'fs';
import path from 'path';

import { TailwindValidator } from '../infrastructure/TailwindValidator';
import { ClassNameExtractionService } from '../services/ClassNameExtractionService';
import { DiagnosticService } from '../services/DiagnosticService';
import { PluginConfigService } from '../services/PluginConfigService';
import { ValidationService } from '../services/ValidationService';
import { Logger, LoggerImpl } from '../utils/Logger';

/**
 * Main plugin class - Refactored with clean architecture and SOLID principles
 *
 * Architecture layers:
 * 1. Core Domain - Types and interfaces (src/core)
 * 2. Extractors - Strategy pattern for class extraction (src/extractors)
 * 3. Services - Business logic orchestration (src/services)
 * 4. Plugin - Thin adapter to TypeScript API (this file)
 *
 * Key improvements:
 * - Single Responsibility: Each class has one clear purpose
 * - Open/Closed: Easy to add new extractors without modifying existing code
 * - Dependency Inversion: Depends on abstractions (interfaces) not concretions
 * - Separation of Concerns: Clear boundaries between layers
 * - Testability: All components can be tested in isolation
 */
export class TailwindTypescriptPlugin {
	private logger!: Logger;
	private validator!: TailwindValidator;
	private validationService!: ValidationService;
	private configService!: PluginConfigService;
	private initializationPromise: Promise<void> | null = null;

	constructor(private readonly typescript: typeof ts) {}

	/**
	 * Create the plugin proxy for TypeScript Language Service
	 */
	create(info: ts.server.PluginCreateInfo): ts.LanguageService {
		this.logger = new LoggerImpl(info);
		this.logger.log('============= Plugin Starting =============');

		// Initialize configuration service
		this.configService = new PluginConfigService(info.config || {}, this.logger);

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

		return proxy;
	}

	/**
	 * Create the getSemanticDiagnostics method with Tailwind validation
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

			// Get fresh type checker from current program (always up-to-date)
			const typeChecker = program.getTypeChecker();

			// Validate and get diagnostics
			const tailwindDiagnostics = this.validationService.validateFile(
				this.typescript,
				sourceFile,
				this.configService.getUtilityFunctions(),
				typeChecker
			);

			return [...prior, ...tailwindDiagnostics];
		};

	/**
	 * Determine if a file should be validated
	 */
	private shouldValidateFile(fileName: string): boolean {
		if (!this.validator || !this.validator.isInitialized()) {
			this.logger.log(`[shouldValidateFile] Validator not initialized yet for ${fileName}`);
			return false;
		}

		// Only process .tsx and .jsx files
		const isJsxFile = fileName.endsWith('.tsx') || fileName.endsWith('.jsx');
		if (!isJsxFile) {
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
}
