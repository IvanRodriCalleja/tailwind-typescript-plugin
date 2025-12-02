import * as ts from 'typescript/lib/tsserverlibrary';
import fs from 'fs';
import path from 'path';

import { TailwindValidator } from '../infrastructure/TailwindValidator';
import { ClassNameExtractionService } from '../services/ClassNameExtractionService';
import { CodeActionService } from '../services/CodeActionService';
import { CompletionService, CompletionServiceConfig } from '../services/CompletionService';
import { DiagnosticService } from '../services/DiagnosticService';
import { FileDiagnosticCache } from '../services/FileDiagnosticCache';
import { PluginConfigService } from '../services/PluginConfigService';
import { ValidationService } from '../services/ValidationService';
import { isSupportedFile } from '../utils/FrameworkDetector';

export class TailwindTypescriptPlugin {
	private validator!: TailwindValidator;
	private validationService!: ValidationService;
	private configService!: PluginConfigService;
	private diagnosticCache!: FileDiagnosticCache;
	private codeActionService!: CodeActionService;
	private completionService!: CompletionService;
	private initializationPromise: Promise<void> | null = null;
	private cssFileWatcher: fs.FSWatcher | null = null;
	private cssFilePath: string | null = null;

	constructor(private readonly typescript: typeof ts) {}

	/**
	 * Create the plugin proxy for TypeScript Language Service
	 */
	create(info: ts.server.PluginCreateInfo): ts.LanguageService {
		// Initialize configuration service
		this.configService = new PluginConfigService(info.config || {});

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
			return;
		}

		const projectRoot = info.project.getCurrentDirectory();
		const relativeCssPath = this.configService.getCssFilePath()!;
		const absoluteCssPath = path.resolve(projectRoot, relativeCssPath);

		if (!fs.existsSync(absoluteCssPath)) {
			return;
		}

		this.cssFilePath = absoluteCssPath;
		this.validator = new TailwindValidator(absoluteCssPath);

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
			this.configService,
			this.validator // Pass as CSS provider for conflict detection
		);

		// Initialize code action service for quick fixes
		this.codeActionService = new CodeActionService(this.validator);

		// Initialize completion service for Tailwind class autocompletion
		const completionConfig: CompletionServiceConfig = {
			utilityFunctions: this.configService.getUtilityFunctions(),
			tailwindVariantsEnabled: this.configService.isTailwindVariantsEnabled(),
			classVarianceAuthorityEnabled: this.configService.isClassVarianceAuthorityEnabled()
		};
		this.completionService = new CompletionService(this.validator, completionConfig);

		// Set allowed classes from config
		const allowedClasses = this.configService.getAllowedClasses();
		if (allowedClasses.length > 0) {
			this.validator.setAllowedClasses(allowedClasses);
		}

		// Start async initialization
		this.initializationPromise = this.validator
			.initialize()
			.then(() => {
				// Set up file watcher after successful initialization
				this.setupCssFileWatcher(info);
			})
			.catch(() => {
				// Initialization failed - validator won't be ready
			});
	}

	/**
	 * Set up file watcher for CSS file changes
	 * When the CSS file changes, reload the design system and clear caches
	 */
	private setupCssFileWatcher(info: ts.server.PluginCreateInfo): void {
		if (!this.cssFilePath) {
			return;
		}

		// Clean up any existing watcher
		if (this.cssFileWatcher) {
			this.cssFileWatcher.close();
			this.cssFileWatcher = null;
		}

		// Debounce timer to avoid multiple reloads for rapid changes
		let debounceTimer: NodeJS.Timeout | null = null;

		try {
			this.cssFileWatcher = fs.watch(this.cssFilePath, eventType => {
				if (eventType === 'change') {
					// Debounce: wait 300ms after last change before reloading
					if (debounceTimer) {
						clearTimeout(debounceTimer);
					}

					debounceTimer = setTimeout(() => {
						this.reloadDesignSystem(info);
					}, 300);
				}
			});

			this.cssFileWatcher.on('error', () => {
				// Watcher error - silently ignore
			});
		} catch {
			// Failed to set up file watcher - silently ignore
		}
	}

	/**
	 * Reload the design system when CSS file changes
	 * Clears all caches and re-initializes the validator
	 */
	private reloadDesignSystem(info: ts.server.PluginCreateInfo): void {
		// Clear the diagnostic cache - all files need revalidation
		this.diagnosticCache.clear();

		// Clear the completion service cache
		if (this.completionService) {
			this.completionService.clearCache();
		}

		// Reload the validator (this clears its internal cache too)
		this.validator
			.reload()
			.then(() => {
				// Notify TypeScript that the project has changed to trigger re-validation
				try {
					// Use 'any' to access internal APIs that aren't in the public type definitions
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const project = info.project as any;

					// Mark project as dirty - this is the most reliable way to trigger updates
					if (project && typeof project.markAsDirty === 'function') {
						project.markAsDirty();
					}

					// Update the project graph to reflect changes
					if (project && typeof project.updateGraph === 'function') {
						project.updateGraph();
					}

					// Access the project service to trigger diagnostic refresh
					// This is the internal API that actually notifies the editor
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const projectService = (project as any).projectService;
					if (projectService) {
						// This method triggers the editor to re-request diagnostics
						if (
							typeof projectService.delayUpdateProjectGraphAndEnsureProjectStructureForOpenFiles ===
							'function'
						) {
							projectService.delayUpdateProjectGraphAndEnsureProjectStructureForOpenFiles();
						}

						// Send custom event to trigger diagnostic refresh in some editors
						if (typeof projectService.sendProjectsUpdatedInBackgroundEvent === 'function') {
							projectService.sendProjectsUpdatedInBackgroundEvent();
						}
					}

					// Try refreshDiagnostics if available (may work in some TS versions)
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					if (project && typeof (project as any).refreshDiagnostics === 'function') {
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						(project as any).refreshDiagnostics();
					}
				} catch {
					// Error notifying project of changes - silently ignore
				}
			})
			.catch(() => {
				// Failed to reload design system - silently ignore
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

		// Override getCompletionsAtPosition to provide Tailwind class completions
		proxy.getCompletionsAtPosition = this.createGetCompletionsAtPosition(info);

		// Override getCompletionEntryDetails to provide CSS documentation for completions
		proxy.getCompletionEntryDetails = this.createGetCompletionEntryDetails(info);

		// Override getQuickInfoAtPosition to provide hover information for Tailwind classes
		proxy.getQuickInfoAtPosition = this.createGetQuickInfoAtPosition(info);

		return proxy;
	}

	/**
	 * Create the getSemanticDiagnostics method with Tailwind validation
	 * PERFORMANCE OPTIMIZED with file-level caching
	 */
	private createGetSemanticDiagnostics =
		(info: ts.server.PluginCreateInfo) =>
		(fileName: string): ts.Diagnostic[] => {
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
				return [...prior, ...cachedDiagnostics];
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
				return prior;
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

			// Get Tailwind quick fixes
			const tailwindFixes = this.codeActionService.getCodeActions(
				this.typescript,
				fileName,
				start,
				end,
				allDiagnostics,
				sourceFile
			);

			return [...prior, ...tailwindFixes];
		};

	/**
	 * Determine if a file should be validated
	 */
	private shouldValidateFile(fileName: string): boolean {
		if (!this.validator || !this.validator.isInitialized()) {
			return false;
		}

		// Process supported framework files (.ts, .tsx, .js, .jsx, .vue, .svelte)
		if (!isSupportedFile(fileName)) {
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

			// Import diagnostic codes
			const TAILWIND_DIAGNOSTIC_CODE = 90001;
			const TAILWIND_DUPLICATE_CODE = 90002;

			// Create refactor info for each diagnostic
			const refactors: ts.ApplicableRefactorInfo[] = [];

			for (const diagnostic of tailwindDiagnostics) {
				if (diagnostic.start === undefined || diagnostic.length === undefined) {
					continue;
				}

				const className = sourceFile.text.substring(
					diagnostic.start,
					diagnostic.start + diagnostic.length
				);

				const actions: ts.RefactorActionInfo[] = [];

				// Handle duplicate class warnings
				if (diagnostic.code === TAILWIND_DUPLICATE_CODE) {
					actions.push({
						name: `remove_duplicate_${diagnostic.start}`,
						description: `Remove duplicate class '${className}'`,
						kind: 'refactor.rewrite.tailwind.removeDuplicate'
					});
				}
				// Handle invalid class errors
				else if (diagnostic.code === TAILWIND_DIAGNOSTIC_CODE) {
					actions.push({
						name: `remove_${diagnostic.start}`,
						description: `Remove invalid class '${className}'`,
						kind: 'refactor.rewrite.tailwind.remove'
					});

					// Add suggestions only for invalid classes
					const suggestions = this.validator.getSimilarClasses(className, 3);
					for (const suggestion of suggestions) {
						actions.push({
							name: `replace_${diagnostic.start}_${suggestion}`,
							description: `Replace with '${suggestion}'`,
							kind: 'refactor.rewrite.tailwind.replace'
						});
					}
				}

				if (actions.length > 0) {
					refactors.push({
						name: 'tailwind-fix',
						description: 'Tailwind CSS Quick Fix',
						actions
					});
				}
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
			// Handle remove_duplicate_ action (for duplicate class warnings)
			if (actionName.startsWith('remove_duplicate_')) {
				const startPos = parseInt(actionName.replace('remove_duplicate_', ''), 10);
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
			}
			// Handle remove_ action (for invalid class errors)
			else if (actionName.startsWith('remove_')) {
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

	/**
	 * Create the getCompletionsAtPosition method with Tailwind class completions
	 */
	private createGetCompletionsAtPosition =
		(info: ts.server.PluginCreateInfo) =>
		(
			fileName: string,
			position: number,
			options: ts.GetCompletionsAtPositionOptions | undefined
		): ts.WithMetadata<ts.CompletionInfo> | undefined => {
			// Get original TypeScript completions
			const prior = info.languageService.getCompletionsAtPosition(fileName, position, options);

			// Skip if completion service not initialized, not a supported file, or editor/autocomplete disabled
			if (
				!this.completionService ||
				!this.shouldValidateFile(fileName) ||
				!this.configService.isAutocompleteEnabled()
			) {
				return prior;
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

			// Get Tailwind completions
			const tailwindCompletions = this.completionService.getCompletionsAtPosition(
				this.typescript,
				sourceFile,
				position,
				prior
			);

			if (!tailwindCompletions) {
				return prior;
			}

			return tailwindCompletions as ts.WithMetadata<ts.CompletionInfo>;
		};

	/**
	 * Create the getCompletionEntryDetails method with CSS documentation
	 */
	private createGetCompletionEntryDetails =
		(info: ts.server.PluginCreateInfo) =>
		(
			fileName: string,
			position: number,
			entryName: string,
			formatOptions: ts.FormatCodeOptions | ts.FormatCodeSettings | undefined,
			source: string | undefined,
			preferences: ts.UserPreferences | undefined,
			data: ts.CompletionEntryData | undefined
		): ts.CompletionEntryDetails | undefined => {
			// Get source file
			const program = info.languageService.getProgram();
			if (!program) {
				return info.languageService.getCompletionEntryDetails(
					fileName,
					position,
					entryName,
					formatOptions,
					source,
					preferences,
					data
				);
			}

			const sourceFile = program.getSourceFile(fileName);
			if (!sourceFile) {
				return info.languageService.getCompletionEntryDetails(
					fileName,
					position,
					entryName,
					formatOptions,
					source,
					preferences,
					data
				);
			}

			// Try to get Tailwind completion details first
			if (
				this.completionService &&
				this.shouldValidateFile(fileName) &&
				this.configService.isAutocompleteEnabled()
			) {
				const tailwindDetails = this.completionService.getCompletionEntryDetails(
					this.typescript,
					sourceFile,
					position,
					entryName
				);

				if (tailwindDetails) {
					return tailwindDetails;
				}
			}

			// Fall back to original TypeScript completion details
			return info.languageService.getCompletionEntryDetails(
				fileName,
				position,
				entryName,
				formatOptions,
				source,
				preferences,
				data
			);
		};

	/**
	 * Create the getQuickInfoAtPosition method with Tailwind hover information
	 */
	private createGetQuickInfoAtPosition =
		(info: ts.server.PluginCreateInfo) =>
		(fileName: string, position: number): ts.QuickInfo | undefined => {
			// Get source file
			const program = info.languageService.getProgram();
			if (!program) {
				return info.languageService.getQuickInfoAtPosition(fileName, position);
			}

			const sourceFile = program.getSourceFile(fileName);
			if (!sourceFile) {
				return info.languageService.getQuickInfoAtPosition(fileName, position);
			}

			// Try to get Tailwind hover info first (only if hover is enabled)
			if (
				this.completionService &&
				this.shouldValidateFile(fileName) &&
				this.configService.isHoverEnabled()
			) {
				const tailwindInfo = this.completionService.getQuickInfoAtPosition(
					this.typescript,
					sourceFile,
					position
				);

				if (tailwindInfo) {
					return tailwindInfo;
				}
			}

			// Fall back to original TypeScript quick info
			return info.languageService.getQuickInfoAtPosition(fileName, position);
		};

	/**
	 * Clean up resources when the plugin is disposed
	 * This closes file watchers and other resources that would otherwise keep the process alive
	 */
	dispose(): void {
		if (this.cssFileWatcher) {
			this.cssFileWatcher.close();
			this.cssFileWatcher = null;
		}
	}
}
