import * as ts from 'typescript/lib/tsserverlibrary';

import { ClassNameInfo, ExtractionContext } from '../core/types';
import { BaseExtractor } from './BaseExtractor';

/**
 * Extracts class names from string literals
 * Example: 'flex items-center'
 */
export class StringLiteralExtractor extends BaseExtractor {
	canHandle(node: ts.Node, context: ExtractionContext): boolean {
		return context.typescript.isStringLiteral(node);
	}

	extract(node: ts.Node, context: ExtractionContext): ClassNameInfo[] {
		if (!context.typescript.isStringLiteral(node)) {
			return [];
		}

		return this.extractFromStringLiteral(node, context);
	}
}
