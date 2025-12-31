import * as ts from 'typescript/lib/tsserverlibrary';

import { IClassNameValidator } from '../core/interfaces';
import { ClassNameExtractionService } from './ClassNameExtractionService';
import { DiagnosticService, TAILWIND_DIAGNOSTIC_CODE, TAILWIND_DUPLICATE_CODE } from './DiagnosticService';
import { PluginConfigService } from './PluginConfigService';
import { ValidationService } from './ValidationService';

describe('ValidationService', () => {
	let validationService: ValidationService;
	let mockValidator: IClassNameValidator;
	let extractionService: ClassNameExtractionService;
	let diagnosticService: DiagnosticService;
	let configService: PluginConfigService;

	const createSourceFile = (code: string, fileName = 'test.tsx'): ts.SourceFile => {
		return ts.createSourceFile(fileName, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
	};

	beforeEach(() => {
		// Create mock validator
		mockValidator = {
			isValidClass: jest.fn((className: string) => {
				// Common valid Tailwind classes
				const validClasses = [
					'flex',
					'items-center',
					'justify-center',
					'text-red-500',
					'text-blue-500',
					'bg-white',
					'p-4',
					'mt-4',
					'mt-8',
					'hidden',
					'block'
				];
				return validClasses.includes(className);
			}),
			isInitialized: jest.fn(() => true),
			setAllowedClasses: jest.fn()
		};

		// Create real services
		extractionService = new ClassNameExtractionService(false, false);
		diagnosticService = new DiagnosticService();
		configService = new PluginConfigService({});

		validationService = new ValidationService(
			extractionService,
			diagnosticService,
			mockValidator,
			configService
		);
	});

	describe('validateFile', () => {
		it('should return empty array when validator is not initialized', () => {
			(mockValidator.isInitialized as jest.Mock).mockReturnValue(false);

			const sourceFile = createSourceFile('<div className="flex">Hello</div>');
			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			expect(diagnostics).toEqual([]);
		});

		it('should detect invalid Tailwind classes', () => {
			const sourceFile = createSourceFile('<div className="invalid-class">Hello</div>');
			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			expect(diagnostics.length).toBeGreaterThan(0);
			expect(diagnostics[0].code).toBe(TAILWIND_DIAGNOSTIC_CODE);
			expect(diagnostics[0].messageText).toContain('invalid-class');
		});

		it('should not report valid Tailwind classes', () => {
			const sourceFile = createSourceFile('<div className="flex items-center">Hello</div>');
			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			// Filter to only validation errors (not duplicate/conflict warnings)
			const validationErrors = diagnostics.filter(d => d.code === TAILWIND_DIAGNOSTIC_CODE);
			expect(validationErrors).toHaveLength(0);
		});

		it('should detect multiple invalid classes', () => {
			const sourceFile = createSourceFile(
				'<div className="invalid1 flex invalid2">Hello</div>'
			);
			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			const validationErrors = diagnostics.filter(d => d.code === TAILWIND_DIAGNOSTIC_CODE);
			expect(validationErrors.length).toBe(2);
		});
	});

	describe('duplicate class detection', () => {
		it('should detect duplicate classes within same attribute', () => {
			const sourceFile = createSourceFile('<div className="flex flex">Hello</div>');
			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			const duplicateWarnings = diagnostics.filter(d => d.code === TAILWIND_DUPLICATE_CODE);
			expect(duplicateWarnings.length).toBeGreaterThan(0);
		});

		it('should not flag classes in different attributes as duplicates', () => {
			const sourceFile = createSourceFile(`
				<div className="flex">
					<span className="flex">Hello</span>
				</div>
			`);
			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			const duplicateWarnings = diagnostics.filter(d => d.code === TAILWIND_DUPLICATE_CODE);
			expect(duplicateWarnings).toHaveLength(0);
		});
	});

	describe('validation configuration', () => {
		it('should respect validation disabled config', () => {
			const disabledConfigService = new PluginConfigService({
				validation: { enabled: false }
			});

			const service = new ValidationService(
				extractionService,
				diagnosticService,
				mockValidator,
				disabledConfigService
			);

			const sourceFile = createSourceFile('<div className="invalid-class">Hello</div>');
			const diagnostics = service.validateFile(ts, sourceFile, []);

			const validationErrors = diagnostics.filter(d => d.code === TAILWIND_DIAGNOSTIC_CODE);
			expect(validationErrors).toHaveLength(0);
		});

		it('should respect validation severity config', () => {
			const warningConfigService = new PluginConfigService({
				validation: { severity: 'warning' }
			});

			const service = new ValidationService(
				extractionService,
				diagnosticService,
				mockValidator,
				warningConfigService
			);

			const sourceFile = createSourceFile('<div className="invalid-class">Hello</div>');
			const diagnostics = service.validateFile(ts, sourceFile, []);

			const validationErrors = diagnostics.filter(d => d.code === TAILWIND_DIAGNOSTIC_CODE);
			expect(validationErrors.length).toBeGreaterThan(0);
			expect(validationErrors[0].category).toBe(ts.DiagnosticCategory.Warning);
		});

		it('should not report when severity is off', () => {
			const offConfigService = new PluginConfigService({
				validation: { severity: 'off' }
			});

			const service = new ValidationService(
				extractionService,
				diagnosticService,
				mockValidator,
				offConfigService
			);

			const sourceFile = createSourceFile('<div className="invalid-class">Hello</div>');
			const diagnostics = service.validateFile(ts, sourceFile, []);

			const validationErrors = diagnostics.filter(d => d.code === TAILWIND_DIAGNOSTIC_CODE);
			expect(validationErrors).toHaveLength(0);
		});
	});

	describe('lint configuration', () => {
		it('should respect lint disabled config', () => {
			const disabledLintConfigService = new PluginConfigService({
				lint: { enabled: false }
			});

			const service = new ValidationService(
				extractionService,
				diagnosticService,
				mockValidator,
				disabledLintConfigService
			);

			const sourceFile = createSourceFile('<div className="flex flex">Hello</div>');
			const diagnostics = service.validateFile(ts, sourceFile, []);

			const duplicateWarnings = diagnostics.filter(d => d.code === TAILWIND_DUPLICATE_CODE);
			expect(duplicateWarnings).toHaveLength(0);
		});

		it('should respect repeated classes disabled config', () => {
			const configService = new PluginConfigService({
				lint: {
					enabled: true,
					repeatedClasses: { enabled: false }
				}
			});

			const service = new ValidationService(
				extractionService,
				diagnosticService,
				mockValidator,
				configService
			);

			const sourceFile = createSourceFile('<div className="flex flex">Hello</div>');
			const diagnostics = service.validateFile(ts, sourceFile, []);

			const duplicateWarnings = diagnostics.filter(d => d.code === TAILWIND_DUPLICATE_CODE);
			expect(duplicateWarnings).toHaveLength(0);
		});

		it('should respect repeated classes severity config', () => {
			const configService = new PluginConfigService({
				lint: {
					repeatedClasses: { severity: 'error' }
				}
			});

			const service = new ValidationService(
				extractionService,
				diagnosticService,
				mockValidator,
				configService
			);

			const sourceFile = createSourceFile('<div className="flex flex">Hello</div>');
			const diagnostics = service.validateFile(ts, sourceFile, []);

			const duplicateWarnings = diagnostics.filter(d => d.code === TAILWIND_DUPLICATE_CODE);
			expect(duplicateWarnings.length).toBeGreaterThan(0);
			expect(duplicateWarnings[0].category).toBe(ts.DiagnosticCategory.Error);
		});
	});

	describe('custom class attributes', () => {
		it('should extract from custom class attributes', () => {
			const customConfigService = new PluginConfigService({
				classAttributes: ['colorStyles']
			});

			const service = new ValidationService(
				extractionService,
				diagnosticService,
				mockValidator,
				customConfigService
			);

			const sourceFile = createSourceFile(
				'<View colorStyles="invalid-custom-class">Hello</View>'
			);
			const diagnostics = service.validateFile(ts, sourceFile, []);

			const validationErrors = diagnostics.filter(d => d.code === TAILWIND_DIAGNOSTIC_CODE);
			expect(validationErrors.length).toBeGreaterThan(0);
			expect(validationErrors[0].messageText).toContain('invalid-custom-class');
		});

		it('should still extract from default attributes when custom ones are added', () => {
			const customConfigService = new PluginConfigService({
				classAttributes: ['customStyles']
			});

			const service = new ValidationService(
				extractionService,
				diagnosticService,
				mockValidator,
				customConfigService
			);

			const sourceFile = createSourceFile('<div className="invalid-class">Hello</div>');
			const diagnostics = service.validateFile(ts, sourceFile, []);

			const validationErrors = diagnostics.filter(d => d.code === TAILWIND_DIAGNOSTIC_CODE);
			expect(validationErrors.length).toBeGreaterThan(0);
		});
	});

	describe('JSX expressions', () => {
		it('should validate classes in string literals', () => {
			const sourceFile = createSourceFile("<div className={'invalid-expr'}>Hello</div>");
			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			const validationErrors = diagnostics.filter(d => d.code === TAILWIND_DIAGNOSTIC_CODE);
			expect(validationErrors.length).toBeGreaterThan(0);
		});

		it('should validate classes in template literals', () => {
			const sourceFile = createSourceFile('<div className={`flex invalid-template`}>Hello</div>');
			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			const validationErrors = diagnostics.filter(d => d.code === TAILWIND_DIAGNOSTIC_CODE);
			expect(validationErrors.length).toBeGreaterThan(0);
			expect(validationErrors[0].messageText).toContain('invalid-template');
		});

		it('should validate classes in ternary expressions', () => {
			const sourceFile = createSourceFile(
				"<div className={true ? 'flex' : 'invalid-ternary'}>Hello</div>"
			);
			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			const validationErrors = diagnostics.filter(d => d.code === TAILWIND_DIAGNOSTIC_CODE);
			expect(validationErrors.length).toBeGreaterThan(0);
			expect(validationErrors[0].messageText).toContain('invalid-ternary');
		});
	});

	describe('empty and edge cases', () => {
		it('should handle empty className', () => {
			const sourceFile = createSourceFile('<div className="">Hello</div>');
			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			expect(diagnostics).toHaveLength(0);
		});

		it('should handle elements without className', () => {
			const sourceFile = createSourceFile('<div>Hello</div>');
			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			expect(diagnostics).toHaveLength(0);
		});

		it('should handle multiple elements', () => {
			const sourceFile = createSourceFile(`
				<div className="invalid1">
					<span className="flex">
						<p className="invalid2">Hello</p>
					</span>
				</div>
			`);
			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			const validationErrors = diagnostics.filter(d => d.code === TAILWIND_DIAGNOSTIC_CODE);
			expect(validationErrors.length).toBe(2);
		});

		it('should handle self-closing elements', () => {
			const sourceFile = createSourceFile('<img className="invalid-self-closing" />');
			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			const validationErrors = diagnostics.filter(d => d.code === TAILWIND_DIAGNOSTIC_CODE);
			expect(validationErrors.length).toBeGreaterThan(0);
		});
	});

	describe('file type support', () => {
		it('should validate TSX files', () => {
			const sourceFile = createSourceFile(
				'<div className="invalid-class">Hello</div>',
				'Component.tsx'
			);
			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			expect(diagnostics.length).toBeGreaterThan(0);
		});

		it('should validate JSX files', () => {
			const sourceFile = ts.createSourceFile(
				'Component.jsx',
				'<div className="invalid-class">Hello</div>',
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.JSX
			);
			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			expect(diagnostics.length).toBeGreaterThan(0);
		});

		it('should return empty for unsupported file types', () => {
			const sourceFile = ts.createSourceFile(
				'styles.css',
				'.class { color: red; }',
				ts.ScriptTarget.Latest,
				true
			);
			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			expect(diagnostics).toHaveLength(0);
		});
	});
});
