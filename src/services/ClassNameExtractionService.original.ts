import * as ts from 'typescript/lib/tsserverlibrary';

import { IClassNameExtractor } from '../core/interfaces';
import { ClassNameInfo, ExtractionContext } from '../core/types';
import { JsxAttributeExtractor } from '../extractors/JsxAttributeExtractor';

/**
 * Service responsible for orchestrating class name extraction from source files
 * Follows the Visitor pattern to traverse the AST
 */
export class ClassNameExtractionService {
	private extractors: IClassNameExtractor[];

	constructor() {
		// Initialize extractors - can be extended with new extractors
		this.extractors = [new JsxAttributeExtractor()];
	}

	/**
	 * Extract all class names from a source file
	 */
	extractFromSourceFile(
		typescript: typeof ts,
		sourceFile: ts.SourceFile,
		utilityFunctions: string[],
		typeChecker?: ts.TypeChecker
	): ClassNameInfo[] {
		const classNames: ClassNameInfo[] = [];
		const context: ExtractionContext = {
			typescript,
			sourceFile,
			utilityFunctions,
			typeChecker
		};

		const visit = (node: ts.Node): void => {
			// Try each extractor to see if it can handle this node
			for (const extractor of this.extractors) {
				if (extractor.canHandle(node, context)) {
					const extracted = extractor.extract(node, context);
					classNames.push(...extracted);
					break; // Stop after first matching extractor
				}
			}

			// Continue traversing the tree
			typescript.forEachChild(node, visit);
		};

		visit(sourceFile);
		return classNames;
	}

	/**
	 * Add a custom extractor (for extensibility)
	 */
	addExtractor(extractor: IClassNameExtractor): void {
		this.extractors.push(extractor);
	}
}
