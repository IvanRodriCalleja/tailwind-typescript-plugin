import * as ts from 'typescript/lib/tsserverlibrary';

import { TailwindValidator } from '../infrastructure/TailwindValidator';
import { TAILWIND_DIAGNOSTIC_CODE } from './DiagnosticService';

/**
 * Service that provides code actions (quick fixes) for Tailwind CSS validation errors
 *
 * Supported quick fixes:
 * - "Remove invalid class" - Removes the invalid class from the className
 * - "Did you mean 'X'?" - Suggests similar valid classes as replacements
 */
export class CodeActionService {
	constructor(private readonly validator: TailwindValidator) {}

	/**
	 * Get the supported code fix error codes
	 */
	getSupportedErrorCodes(): number[] {
		return [TAILWIND_DIAGNOSTIC_CODE];
	}

	/**
	 * Get code actions for a given position in a file
	 * This is called by the TypeScript Language Service when the user requests quick fixes
	 */
	getCodeActions(
		typescript: typeof ts,
		fileName: string,
		start: number,
		end: number,
		diagnostics: ts.Diagnostic[],
		sourceFile: ts.SourceFile
	): ts.CodeFixAction[] {
		const actions: ts.CodeFixAction[] = [];

		// Find Tailwind diagnostics at or overlapping the requested range
		const tailwindDiagnostics = diagnostics.filter(
			d =>
				(d as { source?: string }).source === 'tw-plugin' &&
				d.start !== undefined &&
				d.length !== undefined &&
				this.rangesOverlap(d.start, d.start + d.length, start, end)
		);

		for (const diagnostic of tailwindDiagnostics) {
			if (diagnostic.start === undefined || diagnostic.length === undefined) {
				continue;
			}

			const invalidClass = sourceFile.text.substring(
				diagnostic.start,
				diagnostic.start + diagnostic.length
			);

			// Add "Remove invalid class" action
			actions.push(
				this.createRemoveClassAction(
					typescript,
					fileName,
					diagnostic.start,
					diagnostic.length,
					invalidClass
				)
			);

			// Add "Did you mean 'X'?" suggestions
			const suggestions = this.validator.getSimilarClasses(invalidClass, 3);
			for (const suggestion of suggestions) {
				actions.push(
					this.createReplaceClassAction(
						typescript,
						fileName,
						diagnostic.start,
						diagnostic.length,
						invalidClass,
						suggestion
					)
				);
			}
		}

		return actions;
	}

	/**
	 * Create a code action to remove an invalid class
	 */
	private createRemoveClassAction(
		typescript: typeof ts,
		fileName: string,
		start: number,
		length: number,
		invalidClass: string
	): ts.CodeFixAction {
		// We need to handle whitespace around the class:
		// "flex invalid-class items-center" -> "flex items-center"
		// "invalid-class items-center" -> "items-center"
		// "flex invalid-class" -> "flex"
		// "invalid-class" -> ""
		return {
			fixName: 'removeInvalidTailwindClass',
			description: `Remove invalid class '${invalidClass}'`,
			changes: [
				{
					fileName,
					textChanges: [
						{
							span: { start, length },
							newText: ''
						}
					]
				}
			],
			fixId: 'removeInvalidTailwindClass',
			fixAllDescription: 'Remove all invalid Tailwind classes'
		};
	}

	/**
	 * Create a code action to replace an invalid class with a suggested valid class
	 */
	private createReplaceClassAction(
		typescript: typeof ts,
		fileName: string,
		start: number,
		length: number,
		invalidClass: string,
		suggestion: string
	): ts.CodeFixAction {
		return {
			fixName: 'replaceInvalidTailwindClass',
			description: `Did you mean '${suggestion}'?`,
			changes: [
				{
					fileName,
					textChanges: [
						{
							span: { start, length },
							newText: suggestion
						}
					]
				}
			],
			fixId: `replaceInvalidTailwindClass_${suggestion}`,
			fixAllDescription: undefined
		};
	}

	/**
	 * Check if two ranges overlap
	 */
	private rangesOverlap(start1: number, end1: number, start2: number, end2: number): boolean {
		return start1 < end2 && end1 > start2;
	}
}
