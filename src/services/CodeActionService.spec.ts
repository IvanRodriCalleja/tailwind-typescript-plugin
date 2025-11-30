import * as ts from 'typescript/lib/tsserverlibrary';

import { TailwindValidator } from '../infrastructure/TailwindValidator';
import { CodeActionService } from './CodeActionService';
import { TAILWIND_DIAGNOSTIC_CODE, TAILWIND_DUPLICATE_CODE } from './DiagnosticService';

describe('CodeActionService', () => {
	let validator: TailwindValidator;
	let codeActionService: CodeActionService;

	beforeEach(() => {
		validator = new TailwindValidator('/fake/path.css');
		// Mock the validator methods
		jest.spyOn(validator, 'getSimilarClasses').mockImplementation((invalidClass: string) => {
			if (invalidClass === 'itms-center') {
				return ['items-center', 'items-start', 'items-end'];
			}
			if (invalidClass === 'flx') {
				return ['flex', 'flow-root'];
			}
			return [];
		});
		codeActionService = new CodeActionService(validator);
	});

	describe('getCodeActions', () => {
		it('should return empty array when no Tailwind diagnostics at position', () => {
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				'<div className="flex">Hello</div>',
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics: ts.Diagnostic[] = [];
			const actions = codeActionService.getCodeActions(
				ts,
				'test.tsx',
				0,
				10,
				diagnostics,
				sourceFile
			);

			expect(actions).toHaveLength(0);
		});

		it('should provide "Remove invalid class" action for Tailwind diagnostic', () => {
			const sourceCode = '<div className="itms-center">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			// Position of "itms-center" in the string
			const classStart = 16;
			const classLength = 11;

			const diagnostics: ts.Diagnostic[] = [
				{
					file: sourceFile,
					start: classStart,
					length: classLength,
					messageText: 'The class "itms-center" is not a valid Tailwind class',
					category: ts.DiagnosticCategory.Error,
					code: TAILWIND_DIAGNOSTIC_CODE,
					source: 'tw-plugin'
				} as ts.Diagnostic
			];

			const actions = codeActionService.getCodeActions(
				ts,
				'test.tsx',
				classStart,
				classStart + classLength,
				diagnostics,
				sourceFile
			);

			// Should have 1 remove action + 3 suggestions
			expect(actions.length).toBe(4);

			// First action should be "Remove invalid class"
			expect(actions[0].fixName).toBe('removeInvalidTailwindClass');
			expect(actions[0].description).toBe("Remove invalid class 'itms-center'");
			expect(actions[0].changes[0].textChanges[0].newText).toBe('');
		});

		it('should provide "Did you mean X?" suggestions for similar classes', () => {
			const sourceCode = '<div className="itms-center">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const classStart = 16;
			const classLength = 11;

			const diagnostics: ts.Diagnostic[] = [
				{
					file: sourceFile,
					start: classStart,
					length: classLength,
					messageText: 'The class "itms-center" is not a valid Tailwind class',
					category: ts.DiagnosticCategory.Error,
					code: TAILWIND_DIAGNOSTIC_CODE,
					source: 'tw-plugin'
				} as ts.Diagnostic
			];

			const actions = codeActionService.getCodeActions(
				ts,
				'test.tsx',
				classStart,
				classStart + classLength,
				diagnostics,
				sourceFile
			);

			// Check suggestions
			const suggestions = actions.filter(a => a.fixName === 'replaceInvalidTailwindClass');
			expect(suggestions.length).toBe(3);
			expect(suggestions[0].description).toBe("Did you mean 'items-center'?");
			expect(suggestions[0].changes[0].textChanges[0].newText).toBe('items-center');
		});

		it('should not return actions for non-tw-plugin diagnostics', () => {
			const sourceCode = '<div className="flex">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics: ts.Diagnostic[] = [
				{
					file: sourceFile,
					start: 0,
					length: 10,
					messageText: 'Some TypeScript error',
					category: ts.DiagnosticCategory.Error,
					code: 1234,
					source: 'typescript'
				} as ts.Diagnostic
			];

			const actions = codeActionService.getCodeActions(
				ts,
				'test.tsx',
				0,
				10,
				diagnostics,
				sourceFile
			);

			expect(actions).toHaveLength(0);
		});

		it('should only return actions for diagnostics overlapping the requested range', () => {
			const sourceCode = '<div className="invalid1 invalid2">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics: ts.Diagnostic[] = [
				{
					file: sourceFile,
					start: 16, // "invalid1"
					length: 8,
					messageText: 'The class "invalid1" is not a valid Tailwind class',
					category: ts.DiagnosticCategory.Error,
					code: TAILWIND_DIAGNOSTIC_CODE,
					source: 'tw-plugin'
				} as ts.Diagnostic,
				{
					file: sourceFile,
					start: 25, // "invalid2"
					length: 8,
					messageText: 'The class "invalid2" is not a valid Tailwind class',
					category: ts.DiagnosticCategory.Error,
					code: TAILWIND_DIAGNOSTIC_CODE,
					source: 'tw-plugin'
				} as ts.Diagnostic
			];

			// Request actions only for first invalid class
			const actions = codeActionService.getCodeActions(
				ts,
				'test.tsx',
				16,
				24,
				diagnostics,
				sourceFile
			);

			// Should only have actions for "invalid1", not "invalid2"
			const removeActions = actions.filter(a => a.fixName === 'removeInvalidTailwindClass');
			expect(removeActions.length).toBe(1);
			expect(removeActions[0].description).toContain('invalid1');
		});

		it('should provide "Remove duplicate class" action for duplicate diagnostics', () => {
			const sourceCode = '<div className="flex flex items-center">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			// Position of second "flex" in the string
			const classStart = 21;
			const classLength = 4;

			const diagnostics: ts.Diagnostic[] = [
				{
					file: sourceFile,
					start: classStart,
					length: classLength,
					messageText: 'Duplicate class "flex"',
					category: ts.DiagnosticCategory.Warning,
					code: TAILWIND_DUPLICATE_CODE,
					source: 'tw-plugin'
				} as ts.Diagnostic
			];

			const actions = codeActionService.getCodeActions(
				ts,
				'test.tsx',
				classStart,
				classStart + classLength,
				diagnostics,
				sourceFile
			);

			// Should have 1 remove duplicate action
			expect(actions.length).toBe(1);
			expect(actions[0].fixName).toBe('removeDuplicateTailwindClass');
			expect(actions[0].description).toBe("Remove duplicate class 'flex'");
			expect(actions[0].changes[0].textChanges[0].newText).toBe('');
			expect(actions[0].changes[0].textChanges[0].span.start).toBe(classStart);
			expect(actions[0].changes[0].textChanges[0].span.length).toBe(classLength);
		});

		it('should have fixAll support for duplicate class removal', () => {
			const sourceCode = '<div className="flex flex items-center items-center">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics: ts.Diagnostic[] = [
				{
					file: sourceFile,
					start: 21,
					length: 4,
					messageText: 'Duplicate class "flex"',
					category: ts.DiagnosticCategory.Warning,
					code: TAILWIND_DUPLICATE_CODE,
					source: 'tw-plugin'
				} as ts.Diagnostic
			];

			const actions = codeActionService.getCodeActions(
				ts,
				'test.tsx',
				21,
				25,
				diagnostics,
				sourceFile
			);

			expect(actions[0].fixId).toBe('removeDuplicateTailwindClass');
			expect(actions[0].fixAllDescription).toBe('Remove all duplicate Tailwind classes');
		});
	});
});
