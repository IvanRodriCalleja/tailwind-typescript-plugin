/* eslint-disable @typescript-eslint/no-unused-vars */
import * as ts from 'typescript/lib/tsserverlibrary';

import { ClassNameInfo, ExtractionContext } from '../core/types';
import { BaseExtractor } from './BaseExtractor';

/**
 * Extracts class names from Vue template class attributes
 * Assumes @vue/language-tools is configured and transforms Vue templates
 *
 * TODO: Implement Vue-specific extraction logic
 * - Handle :class (v-bind:class) dynamic bindings
 * - Handle class static attributes
 * - Handle object syntax: :class="{ 'active': isActive }"
 * - Handle array syntax: :class="['base', { 'active': isActive }]"
 */
export class VueAttributeExtractor extends BaseExtractor {
	canHandle(node: ts.Node, context: ExtractionContext): boolean {
		// TODO: Implement Vue node detection
		// For now, return false as this is a stub
		return false;
	}

	extract(node: ts.Node, context: ExtractionContext): ClassNameInfo[] {
		// TODO: Implement Vue class extraction
		// This is a placeholder that will be implemented in the next phase
		return [];
	}
}
