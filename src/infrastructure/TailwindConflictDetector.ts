import postcss from 'postcss';

import { ClassNameInfo } from '../core/types';

/**
 * Information about a conflicting class
 */
export interface ConflictInfo {
	/** The class that has a conflict */
	classInfo: ClassNameInfo;
	/** The class(es) it conflicts with */
	conflictsWith: string[];
	/** The CSS property that is being overwritten (e.g., 'text-align', 'display') */
	cssProperty: string;
}

/**
 * Represents the CSS output analysis for a class
 */
interface ClassCssInfo {
	/** The CSS properties this class sets */
	properties: string[];
	/** The context path (media queries, pseudo-selectors, etc.) */
	context: string[];
}

/**
 * Interface for getting CSS from class names
 */
export interface ICssProvider {
	getCssForClasses(classNames: string[]): (string | null)[];
}

/**
 * Service for detecting conflicting Tailwind CSS utility classes.
 * Uses Tailwind's design system to compile classes and analyze their CSS output.
 * Two classes conflict when they set the same CSS properties in the same context.
 */
export class TailwindConflictDetector {
	private cssProvider: ICssProvider | null = null;

	/**
	 * Set the CSS provider (TailwindValidator)
	 */
	setCssProvider(provider: ICssProvider): void {
		this.cssProvider = provider;
	}

	/**
	 * Parse CSS string and extract properties and context
	 */
	private parseCss(css: string): ClassCssInfo[] {
		const results: ClassCssInfo[] = [];

		try {
			const root = postcss.parse(css);

			// Walk through all rules and at-rules
			const visit = (node: postcss.ChildNode, contextPath: string[] = []): void => {
				if (node.type === 'rule') {
					// Extract properties from declarations
					const properties: string[] = [];
					node.nodes?.forEach(child => {
						if (child.type === 'decl') {
							properties.push(child.prop);
						}
					});

					if (properties.length > 0) {
						results.push({
							properties: properties.sort(),
							context: contextPath.slice(1) // Skip the class selector itself
						});
					}

					// Recursively visit nested rules
					node.nodes?.forEach(child => {
						if (child.type === 'rule' || child.type === 'atrule') {
							const newContext =
								child.type === 'rule' ? child.selector : `@${child.name} ${child.params}`.trim();
							visit(child, [...contextPath, newContext]);
						}
					});
				} else if (node.type === 'atrule') {
					const atRuleContext = `@${node.name} ${node.params}`.trim();
					node.nodes?.forEach(child => {
						visit(child, [...contextPath, atRuleContext]);
					});
				}
			};

			root.nodes?.forEach(node => {
				if (node.type === 'rule') {
					visit(node, [node.selector]);
				} else if (node.type === 'atrule') {
					visit(node, []);
				}
			});
		} catch {
			// If parsing fails, return empty results
		}

		return results;
	}

	/**
	 * Extract the prefix (variants) from a class name.
	 * e.g., "md:hover:text-left" -> "md:hover:"
	 */
	private extractPrefix(className: string): string {
		const parts = className.split(':');
		if (parts.length <= 1) return '';
		return parts.slice(0, -1).join(':') + ':';
	}

	/**
	 * Compare two ClassCssInfo arrays for equality
	 */
	private cssInfoEquals(a: ClassCssInfo[], b: ClassCssInfo[]): boolean {
		if (a.length !== b.length) return false;

		for (let i = 0; i < a.length; i++) {
			const entryA = a[i];
			const entryB = b[i];

			// Compare properties
			if (entryA.properties.length !== entryB.properties.length) return false;
			for (let j = 0; j < entryA.properties.length; j++) {
				if (entryA.properties[j] !== entryB.properties[j]) return false;
			}

			// Compare context
			if (entryA.context.length !== entryB.context.length) return false;
			for (let j = 0; j < entryA.context.length; j++) {
				if (entryA.context[j] !== entryB.context[j]) return false;
			}
		}

		return true;
	}

	/**
	 * Find all conflicting classes in a list of ClassNameInfo.
	 * Returns ConflictInfo for each class that conflicts with another.
	 */
	findConflicts(classNames: ClassNameInfo[]): ConflictInfo[] {
		if (!this.cssProvider) {
			return [];
		}

		const conflicts: ConflictInfo[] = [];

		// Group classes by attributeId (conflicts are only within same attribute)
		const byAttribute = new Map<string, ClassNameInfo[]>();

		for (const classInfo of classNames) {
			const key = classInfo.attributeId || `${classInfo.absoluteStart}`;
			if (!byAttribute.has(key)) {
				byAttribute.set(key, []);
			}
			byAttribute.get(key)!.push(classInfo);
		}

		// For each attribute, find conflicts
		for (const classes of byAttribute.values()) {
			const attributeConflicts = this.findConflictsInAttribute(classes);
			conflicts.push(...attributeConflicts);
		}

		return conflicts;
	}

	/**
	 * Find conflicts within a single attribute's classes.
	 * Handles conditional branches - classes in mutually exclusive branches don't conflict.
	 * Also handles base vs variant separation for tv()/cva() - variants are designed to override base.
	 */
	private findConflictsInAttribute(classes: ClassNameInfo[]): ConflictInfo[] {
		const conflicts: ConflictInfo[] = [];

		// First, separate base classes from variant classes (for tv()/cva())
		// Variant classes are designed to override base, so they don't conflict with base
		const baseClasses = classes.filter(c => !c.isVariant);
		const variantClasses = classes.filter(c => c.isVariant);

		// Process base classes and variant classes separately
		// They can conflict within themselves, but NOT with each other
		conflicts.push(...this.findConflictsInClassGroup(baseClasses));
		conflicts.push(...this.findConflictsInClassGroup(variantClasses));

		return conflicts;
	}

	/**
	 * Find conflicts within a group of classes (either all base or all variant).
	 * Handles conditional branches - classes in mutually exclusive branches don't conflict.
	 */
	private findConflictsInClassGroup(classes: ClassNameInfo[]): ConflictInfo[] {
		const conflicts: ConflictInfo[] = [];

		// Separate root classes from branch classes
		const rootClasses = classes.filter(c => !c.conditionalBranchId);
		const branchClasses = classes.filter(c => c.conditionalBranchId);

		// 1. Find conflicts among root classes
		const rootConflicts = this.findConflictsInList(rootClasses);
		conflicts.push(...rootConflicts);

		// 2. Find conflicts between root classes and branch classes
		for (const rootClass of rootClasses) {
			for (const branchClass of branchClasses) {
				const conflictProperty = this.getConflictProperty(
					rootClass.className,
					branchClass.className
				);
				if (conflictProperty) {
					conflicts.push({
						classInfo: branchClass,
						conflictsWith: [rootClass.className],
						cssProperty: conflictProperty
					});
				}
			}
		}

		// 3. Find conflicts within the same branch
		const byBranch = new Map<string, ClassNameInfo[]>();
		for (const branchClass of branchClasses) {
			const branchId = branchClass.conditionalBranchId!;
			if (!byBranch.has(branchId)) {
				byBranch.set(branchId, []);
			}
			byBranch.get(branchId)!.push(branchClass);
		}

		for (const branchClassList of byBranch.values()) {
			const branchConflicts = this.findConflictsInList(branchClassList);
			conflicts.push(...branchConflicts);
		}

		return conflicts;
	}

	/**
	 * Get the CSS property that causes a conflict between two classes, or null if no conflict.
	 */
	private getConflictProperty(className1: string, className2: string): string | null {
		if (!this.cssProvider) return null;
		if (className1 === className2) return null;

		// Classes with different prefixes don't conflict
		const prefix1 = this.extractPrefix(className1);
		const prefix2 = this.extractPrefix(className2);
		if (prefix1 !== prefix2) return null;

		const cssResults = this.cssProvider.getCssForClasses([className1, className2]);
		const css1 = cssResults[0];
		const css2 = cssResults[1];

		if (!css1 || !css2) return null;

		const info1 = this.parseCss(css1);
		const info2 = this.parseCss(css2);

		// Check if they have the same properties in the same context
		if (this.cssInfoEquals(info1, info2)) {
			// Return the properties as the conflict identifier
			if (info1.length > 0 && info1[0].properties.length > 0) {
				return info1[0].properties.join(', ');
			}
		}

		return null;
	}

	/**
	 * Find conflicts in a flat list of classes (no branch handling).
	 */
	private findConflictsInList(classes: ClassNameInfo[]): ConflictInfo[] {
		if (!this.cssProvider || classes.length === 0) return [];

		const conflicts: ConflictInfo[] = [];

		// Get CSS for all classes at once (batch)
		const classNames = classes.map(c => c.className);
		const cssResults = this.cssProvider.getCssForClasses(classNames);

		// Parse CSS and build info map
		const classInfoMap = new Map<ClassNameInfo, { cssInfo: ClassCssInfo[]; prefix: string }>();

		for (let i = 0; i < classes.length; i++) {
			const classInfo = classes[i];
			const css = cssResults[i];
			if (css) {
				classInfoMap.set(classInfo, {
					cssInfo: this.parseCss(css),
					prefix: this.extractPrefix(classInfo.className)
				});
			}
		}

		// Compare all pairs
		const classesWithCss = [...classInfoMap.keys()];
		const conflictMap = new Map<ClassNameInfo, Set<string>>();

		for (let i = 0; i < classesWithCss.length; i++) {
			for (let j = i + 1; j < classesWithCss.length; j++) {
				const classA = classesWithCss[i];
				const classB = classesWithCss[j];

				// Skip duplicate classes (same class name) - duplicates are handled separately
				if (classA.className === classB.className) continue;

				const infoA = classInfoMap.get(classA)!;
				const infoB = classInfoMap.get(classB)!;

				// Different prefixes don't conflict
				if (infoA.prefix !== infoB.prefix) continue;

				// Check if same CSS structure (properties + context)
				if (this.cssInfoEquals(infoA.cssInfo, infoB.cssInfo)) {
					const cssProperty =
						infoA.cssInfo.length > 0 && infoA.cssInfo[0].properties.length > 0
							? infoA.cssInfo[0].properties.join(', ')
							: 'unknown';

					// Add to conflict map for classA
					if (!conflictMap.has(classA)) {
						conflictMap.set(classA, new Set());
					}
					conflictMap.get(classA)!.add(classB.className);

					// Add to conflict map for classB
					if (!conflictMap.has(classB)) {
						conflictMap.set(classB, new Set());
					}
					conflictMap.get(classB)!.add(classA.className);

					// Create conflict entries (we'll dedupe below)
					const existingA = conflicts.find(c => c.classInfo === classA);
					const existingB = conflicts.find(c => c.classInfo === classB);

					if (existingA) {
						existingA.conflictsWith.push(classB.className);
					} else {
						conflicts.push({
							classInfo: classA,
							conflictsWith: [classB.className],
							cssProperty
						});
					}

					if (existingB) {
						existingB.conflictsWith.push(classA.className);
					} else {
						conflicts.push({
							classInfo: classB,
							conflictsWith: [classA.className],
							cssProperty
						});
					}
				}
			}
		}

		// Dedupe conflictsWith arrays
		for (const conflict of conflicts) {
			conflict.conflictsWith = [...new Set(conflict.conflictsWith)];
		}

		return conflicts;
	}

	/**
	 * Check if two class names conflict with each other.
	 */
	doClassesConflict(className1: string, className2: string): boolean {
		return this.getConflictProperty(className1, className2) !== null;
	}

	/**
	 * Get the conflict group for a class name, if any.
	 * Returns the CSS properties that this class affects.
	 */
	getConflictGroup(className: string): string | null {
		if (!this.cssProvider) return null;

		const cssResults = this.cssProvider.getCssForClasses([className]);
		const css = cssResults[0];

		if (!css) return null;

		const info = this.parseCss(css);
		if (info.length > 0 && info[0].properties.length > 0) {
			return info[0].properties.join(', ');
		}

		return null;
	}

	/**
	 * Get all classes that would conflict with a given class.
	 * Note: This is a simplified implementation that returns an empty array
	 * since we no longer have a static conflict group map.
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	getConflictingClasses(className: string): string[] {
		// Without a full class list, we can't enumerate all conflicting classes
		// This would require iterating over all possible Tailwind classes
		return [];
	}
}
