import * as ts from 'typescript/lib/tsserverlibrary';

import { ClassNameInfo } from '../core/types';
import { ConflictInfo } from '../infrastructure/TailwindConflictDetector';
import {
	DiagnosticService,
	TAILWIND_CONFLICT_CODE,
	TAILWIND_DIAGNOSTIC_CODE,
	TAILWIND_DUPLICATE_CODE,
	TAILWIND_EXTRACTABLE_CLASS_CODE
} from './DiagnosticService';

describe('DiagnosticService', () => {
	let service: DiagnosticService;
	let mockSourceFile: ts.SourceFile;

	beforeEach(() => {
		service = new DiagnosticService();
		mockSourceFile = ts.createSourceFile(
			'test.tsx',
			'<div className="flex items-center">Hello</div>',
			ts.ScriptTarget.Latest,
			true,
			ts.ScriptKind.TSX
		);
	});

	const createClassNameInfo = (
		className: string,
		overrides: Partial<ClassNameInfo> = {}
	): ClassNameInfo => ({
		className,
		absoluteStart: 15,
		length: className.length,
		line: 1,
		file: 'test.tsx',
		...overrides
	});

	describe('createDiagnostic', () => {
		it('should create error diagnostic for invalid class', () => {
			const classInfo = createClassNameInfo('invalid-class');

			const diagnostic = service.createDiagnostic(classInfo, mockSourceFile);

			expect(diagnostic.code).toBe(TAILWIND_DIAGNOSTIC_CODE);
			expect(diagnostic.category).toBe(ts.DiagnosticCategory.Error);
			expect(diagnostic.messageText).toContain('invalid-class');
			expect(diagnostic.messageText).toContain('not a valid Tailwind class');
			expect(diagnostic.start).toBe(15);
			expect(diagnostic.length).toBe('invalid-class'.length);
			expect((diagnostic as { source?: string }).source).toBe('tw-plugin');
		});

		it('should create warning diagnostic when severity is warning', () => {
			const classInfo = createClassNameInfo('invalid-class');

			const diagnostic = service.createDiagnostic(classInfo, mockSourceFile, 'warning');

			expect(diagnostic.category).toBe(ts.DiagnosticCategory.Warning);
		});

		it('should create suggestion diagnostic when severity is suggestion', () => {
			const classInfo = createClassNameInfo('invalid-class');

			const diagnostic = service.createDiagnostic(classInfo, mockSourceFile, 'suggestion');

			expect(diagnostic.category).toBe(ts.DiagnosticCategory.Suggestion);
		});

		it('should include variable usage context in message', () => {
			const classInfo = createClassNameInfo('invalid-class', {
				variableUsage: {
					variableName: 'styles',
					usageLine: 10
				}
			});

			const diagnostic = service.createDiagnostic(classInfo, mockSourceFile);

			expect(diagnostic.messageText).toContain('variable "styles"');
			expect(diagnostic.messageText).toContain('line 10');
		});
	});

	describe('createDuplicateDiagnostic', () => {
		it('should create warning diagnostic for duplicate class', () => {
			const classInfo = createClassNameInfo('flex');

			const diagnostic = service.createDuplicateDiagnostic(classInfo, mockSourceFile);

			expect(diagnostic.code).toBe(TAILWIND_DUPLICATE_CODE);
			expect(diagnostic.category).toBe(ts.DiagnosticCategory.Warning);
			expect(diagnostic.messageText).toContain('Duplicate class');
			expect(diagnostic.messageText).toContain('flex');
		});

		it('should respect custom severity', () => {
			const classInfo = createClassNameInfo('flex');

			const diagnostic = service.createDuplicateDiagnostic(classInfo, mockSourceFile, 'error');

			expect(diagnostic.category).toBe(ts.DiagnosticCategory.Error);
		});

		it('should include variable usage context in message', () => {
			const classInfo = createClassNameInfo('flex', {
				variableUsage: {
					variableName: 'baseStyles',
					usageLine: 5
				}
			});

			const diagnostic = service.createDuplicateDiagnostic(classInfo, mockSourceFile);

			expect(diagnostic.messageText).toContain('variable "baseStyles"');
			expect(diagnostic.messageText).toContain('line 5');
		});
	});

	describe('createDiagnostics', () => {
		it('should create multiple diagnostics from array', () => {
			const classInfos = [createClassNameInfo('invalid1'), createClassNameInfo('invalid2')];

			const diagnostics = service.createDiagnostics(classInfos, mockSourceFile);

			expect(diagnostics).toHaveLength(2);
			expect(diagnostics[0].messageText).toContain('invalid1');
			expect(diagnostics[1].messageText).toContain('invalid2');
		});

		it('should return empty array for empty input', () => {
			const diagnostics = service.createDiagnostics([], mockSourceFile);

			expect(diagnostics).toEqual([]);
		});

		it('should apply severity to all diagnostics', () => {
			const classInfos = [createClassNameInfo('invalid1'), createClassNameInfo('invalid2')];

			const diagnostics = service.createDiagnostics(classInfos, mockSourceFile, 'warning');

			expect(diagnostics[0].category).toBe(ts.DiagnosticCategory.Warning);
			expect(diagnostics[1].category).toBe(ts.DiagnosticCategory.Warning);
		});
	});

	describe('createDuplicateDiagnostics', () => {
		it('should create multiple duplicate diagnostics from array', () => {
			const classInfos = [createClassNameInfo('flex'), createClassNameInfo('flex')];

			const diagnostics = service.createDuplicateDiagnostics(classInfos, mockSourceFile);

			expect(diagnostics).toHaveLength(2);
			diagnostics.forEach(d => {
				expect(d.code).toBe(TAILWIND_DUPLICATE_CODE);
			});
		});
	});

	describe('createExtractableClassDiagnostic', () => {
		it('should create warning diagnostic for extractable class', () => {
			const classInfo = createClassNameInfo('text-center');

			const diagnostic = service.createExtractableClassDiagnostic(classInfo, mockSourceFile);

			expect(diagnostic.code).toBe(TAILWIND_EXTRACTABLE_CLASS_CODE);
			expect(diagnostic.category).toBe(ts.DiagnosticCategory.Warning);
			expect(diagnostic.messageText).toContain('text-center');
			expect(diagnostic.messageText).toContain('repeated in both branches');
			expect(diagnostic.messageText).toContain('moving it outside the conditional');
		});
	});

	describe('createExtractableClassDiagnostics', () => {
		it('should create multiple extractable diagnostics from array', () => {
			const classInfos = [createClassNameInfo('flex'), createClassNameInfo('items-center')];

			const diagnostics = service.createExtractableClassDiagnostics(classInfos, mockSourceFile);

			expect(diagnostics).toHaveLength(2);
			diagnostics.forEach(d => {
				expect(d.code).toBe(TAILWIND_EXTRACTABLE_CLASS_CODE);
			});
		});
	});

	describe('createConflictDiagnostic', () => {
		it('should create warning diagnostic for conflicting classes', () => {
			const conflictInfo: ConflictInfo = {
				classInfo: createClassNameInfo('text-red-500'),
				conflictsWith: ['text-blue-500', 'text-green-500'],
				cssProperty: 'color'
			};

			const diagnostic = service.createConflictDiagnostic(conflictInfo, mockSourceFile);

			expect(diagnostic.code).toBe(TAILWIND_CONFLICT_CODE);
			expect(diagnostic.category).toBe(ts.DiagnosticCategory.Warning);
			expect(diagnostic.messageText).toContain('text-red-500');
			expect(diagnostic.messageText).toContain('conflicts with');
			expect(diagnostic.messageText).toContain('text-blue-500, text-green-500');
			expect(diagnostic.messageText).toContain('color property');
		});

		it('should respect custom severity', () => {
			const conflictInfo: ConflictInfo = {
				classInfo: createClassNameInfo('mt-4'),
				conflictsWith: ['mt-8'],
				cssProperty: 'margin-top'
			};

			const diagnostic = service.createConflictDiagnostic(conflictInfo, mockSourceFile, 'error');

			expect(diagnostic.category).toBe(ts.DiagnosticCategory.Error);
		});

		it('should include variable usage context in message', () => {
			const conflictInfo: ConflictInfo = {
				classInfo: createClassNameInfo('pt-4', {
					variableUsage: {
						variableName: 'spacing',
						usageLine: 20
					}
				}),
				conflictsWith: ['pt-8'],
				cssProperty: 'padding-top'
			};

			const diagnostic = service.createConflictDiagnostic(conflictInfo, mockSourceFile);

			expect(diagnostic.messageText).toContain('variable "spacing"');
			expect(diagnostic.messageText).toContain('line 20');
		});
	});

	describe('createConflictDiagnostics', () => {
		it('should create multiple conflict diagnostics from array', () => {
			const conflictInfos: ConflictInfo[] = [
				{
					classInfo: createClassNameInfo('text-red-500'),
					conflictsWith: ['text-blue-500'],
					cssProperty: 'color'
				},
				{
					classInfo: createClassNameInfo('mt-4'),
					conflictsWith: ['mt-8'],
					cssProperty: 'margin-top'
				}
			];

			const diagnostics = service.createConflictDiagnostics(conflictInfos, mockSourceFile);

			expect(diagnostics).toHaveLength(2);
			diagnostics.forEach(d => {
				expect(d.code).toBe(TAILWIND_CONFLICT_CODE);
			});
		});
	});

	describe('diagnostic codes', () => {
		it('should use distinct codes for each diagnostic type', () => {
			expect(TAILWIND_DIAGNOSTIC_CODE).toBe(90001);
			expect(TAILWIND_DUPLICATE_CODE).toBe(90002);
			expect(TAILWIND_EXTRACTABLE_CLASS_CODE).toBe(90003);
			expect(TAILWIND_CONFLICT_CODE).toBe(90004);

			// Verify they are all unique
			const codes = [
				TAILWIND_DIAGNOSTIC_CODE,
				TAILWIND_DUPLICATE_CODE,
				TAILWIND_EXTRACTABLE_CLASS_CODE,
				TAILWIND_CONFLICT_CODE
			];
			expect(new Set(codes).size).toBe(codes.length);
		});
	});

	describe('source file reference', () => {
		it('should reference the source file in diagnostics', () => {
			const classInfo = createClassNameInfo('invalid-class');

			const diagnostic = service.createDiagnostic(classInfo, mockSourceFile);

			expect(diagnostic.file).toBe(mockSourceFile);
		});
	});

	describe('position accuracy', () => {
		it('should preserve absoluteStart and length from classInfo', () => {
			const classInfo = createClassNameInfo('test-class', {
				absoluteStart: 42,
				length: 10
			});

			const diagnostic = service.createDiagnostic(classInfo, mockSourceFile);

			expect(diagnostic.start).toBe(42);
			expect(diagnostic.length).toBe(10);
		});
	});
});
