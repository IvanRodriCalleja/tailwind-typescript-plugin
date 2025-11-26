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
 * Conflict groups define sets of Tailwind classes that affect the same CSS property.
 * When multiple classes from the same group are used together, they conflict.
 */
const CONFLICT_GROUPS: Record<string, string[]> = {
	// Text alignment
	'text-align': [
		'text-left',
		'text-center',
		'text-right',
		'text-justify',
		'text-start',
		'text-end'
	],

	// Display
	display: [
		'block',
		'inline-block',
		'inline',
		'flex',
		'inline-flex',
		'table',
		'inline-table',
		'table-caption',
		'table-cell',
		'table-column',
		'table-column-group',
		'table-footer-group',
		'table-header-group',
		'table-row-group',
		'table-row',
		'flow-root',
		'grid',
		'inline-grid',
		'contents',
		'list-item',
		'hidden'
	],

	// Position
	position: ['static', 'fixed', 'absolute', 'relative', 'sticky'],

	// Visibility
	visibility: ['visible', 'invisible', 'collapse'],

	// Flex direction
	'flex-direction': ['flex-row', 'flex-row-reverse', 'flex-col', 'flex-col-reverse'],

	// Flex wrap
	'flex-wrap': ['flex-wrap', 'flex-wrap-reverse', 'flex-nowrap'],

	// Justify content
	'justify-content': [
		'justify-normal',
		'justify-start',
		'justify-end',
		'justify-center',
		'justify-between',
		'justify-around',
		'justify-evenly',
		'justify-stretch'
	],

	// Justify items
	'justify-items': [
		'justify-items-start',
		'justify-items-end',
		'justify-items-center',
		'justify-items-stretch'
	],

	// Justify self
	'justify-self': [
		'justify-self-auto',
		'justify-self-start',
		'justify-self-end',
		'justify-self-center',
		'justify-self-stretch'
	],

	// Align content
	'align-content': [
		'content-normal',
		'content-center',
		'content-start',
		'content-end',
		'content-between',
		'content-around',
		'content-evenly',
		'content-baseline',
		'content-stretch'
	],

	// Align items
	'align-items': ['items-start', 'items-end', 'items-center', 'items-baseline', 'items-stretch'],

	// Align self
	'align-self': [
		'self-auto',
		'self-start',
		'self-end',
		'self-center',
		'self-stretch',
		'self-baseline'
	],

	// Place content
	'place-content': [
		'place-content-center',
		'place-content-start',
		'place-content-end',
		'place-content-between',
		'place-content-around',
		'place-content-evenly',
		'place-content-baseline',
		'place-content-stretch'
	],

	// Place items
	'place-items': [
		'place-items-start',
		'place-items-end',
		'place-items-center',
		'place-items-baseline',
		'place-items-stretch'
	],

	// Place self
	'place-self': [
		'place-self-auto',
		'place-self-start',
		'place-self-end',
		'place-self-center',
		'place-self-stretch'
	],

	// Float
	float: ['float-start', 'float-end', 'float-right', 'float-left', 'float-none'],

	// Clear
	clear: ['clear-start', 'clear-end', 'clear-left', 'clear-right', 'clear-both', 'clear-none'],

	// Object fit
	'object-fit': [
		'object-contain',
		'object-cover',
		'object-fill',
		'object-none',
		'object-scale-down'
	],

	// Overflow
	overflow: [
		'overflow-auto',
		'overflow-hidden',
		'overflow-clip',
		'overflow-visible',
		'overflow-scroll'
	],
	'overflow-x': [
		'overflow-x-auto',
		'overflow-x-hidden',
		'overflow-x-clip',
		'overflow-x-visible',
		'overflow-x-scroll'
	],
	'overflow-y': [
		'overflow-y-auto',
		'overflow-y-hidden',
		'overflow-y-clip',
		'overflow-y-visible',
		'overflow-y-scroll'
	],

	// Overscroll behavior
	overscroll: ['overscroll-auto', 'overscroll-contain', 'overscroll-none'],
	'overscroll-x': ['overscroll-x-auto', 'overscroll-x-contain', 'overscroll-x-none'],
	'overscroll-y': ['overscroll-y-auto', 'overscroll-y-contain', 'overscroll-y-none'],

	// Scroll behavior
	'scroll-behavior': ['scroll-auto', 'scroll-smooth'],

	// Text overflow
	'text-overflow': ['truncate', 'text-ellipsis', 'text-clip'],

	// Text wrap
	'text-wrap': ['text-wrap', 'text-nowrap', 'text-balance', 'text-pretty'],

	// Whitespace
	whitespace: [
		'whitespace-normal',
		'whitespace-nowrap',
		'whitespace-pre',
		'whitespace-pre-line',
		'whitespace-pre-wrap',
		'whitespace-break-spaces'
	],

	// Word break
	'word-break': ['break-normal', 'break-words', 'break-all', 'break-keep'],

	// Hyphens
	hyphens: ['hyphens-none', 'hyphens-manual', 'hyphens-auto'],

	// List style position
	'list-style-position': ['list-inside', 'list-outside'],

	// Border collapse
	'border-collapse': ['border-collapse', 'border-separate'],

	// Table layout
	'table-layout': ['table-auto', 'table-fixed'],

	// Caption side
	'caption-side': ['caption-top', 'caption-bottom'],

	// Box decoration break
	'box-decoration-break': ['box-decoration-clone', 'box-decoration-slice'],

	// Box sizing
	'box-sizing': ['box-border', 'box-content'],

	// Isolation
	isolation: ['isolate', 'isolation-auto'],

	// Mix blend mode
	'mix-blend-mode': [
		'mix-blend-normal',
		'mix-blend-multiply',
		'mix-blend-screen',
		'mix-blend-overlay',
		'mix-blend-darken',
		'mix-blend-lighten',
		'mix-blend-color-dodge',
		'mix-blend-color-burn',
		'mix-blend-hard-light',
		'mix-blend-soft-light',
		'mix-blend-difference',
		'mix-blend-exclusion',
		'mix-blend-hue',
		'mix-blend-saturation',
		'mix-blend-color',
		'mix-blend-luminosity',
		'mix-blend-plus-darker',
		'mix-blend-plus-lighter'
	],

	// Background blend mode
	'background-blend-mode': [
		'bg-blend-normal',
		'bg-blend-multiply',
		'bg-blend-screen',
		'bg-blend-overlay',
		'bg-blend-darken',
		'bg-blend-lighten',
		'bg-blend-color-dodge',
		'bg-blend-color-burn',
		'bg-blend-hard-light',
		'bg-blend-soft-light',
		'bg-blend-difference',
		'bg-blend-exclusion',
		'bg-blend-hue',
		'bg-blend-saturation',
		'bg-blend-color',
		'bg-blend-luminosity'
	],

	// Background attachment
	'background-attachment': ['bg-fixed', 'bg-local', 'bg-scroll'],

	// Background clip
	'background-clip': ['bg-clip-border', 'bg-clip-padding', 'bg-clip-content', 'bg-clip-text'],

	// Background origin
	'background-origin': ['bg-origin-border', 'bg-origin-padding', 'bg-origin-content'],

	// Background repeat
	'background-repeat': [
		'bg-repeat',
		'bg-no-repeat',
		'bg-repeat-x',
		'bg-repeat-y',
		'bg-repeat-round',
		'bg-repeat-space'
	],

	// Background size
	'background-size': ['bg-auto', 'bg-cover', 'bg-contain'],

	// Border style
	'border-style': [
		'border-solid',
		'border-dashed',
		'border-dotted',
		'border-double',
		'border-hidden',
		'border-none'
	],

	// Outline style
	'outline-style': [
		'outline-none',
		'outline',
		'outline-dashed',
		'outline-dotted',
		'outline-double'
	],

	// Font style
	'font-style': ['italic', 'not-italic'],

	// Font variant numeric
	'font-variant-numeric': [
		'normal-nums',
		'ordinal',
		'slashed-zero',
		'lining-nums',
		'oldstyle-nums',
		'proportional-nums',
		'tabular-nums',
		'diagonal-fractions',
		'stacked-fractions'
	],

	// Text decoration line
	'text-decoration-line': ['underline', 'overline', 'line-through', 'no-underline'],

	// Text decoration style
	'text-decoration-style': [
		'decoration-solid',
		'decoration-double',
		'decoration-dotted',
		'decoration-dashed',
		'decoration-wavy'
	],

	// Text transform
	'text-transform': ['uppercase', 'lowercase', 'capitalize', 'normal-case'],

	// Vertical align
	'vertical-align': [
		'align-baseline',
		'align-top',
		'align-middle',
		'align-bottom',
		'align-text-top',
		'align-text-bottom',
		'align-sub',
		'align-super'
	],

	// Resize
	resize: ['resize-none', 'resize-y', 'resize-x', 'resize'],

	// Scroll snap align
	'scroll-snap-align': ['snap-start', 'snap-end', 'snap-center', 'snap-align-none'],

	// Scroll snap stop
	'scroll-snap-stop': ['snap-normal', 'snap-always'],

	// Scroll snap type
	'scroll-snap-type': ['snap-none', 'snap-x', 'snap-y', 'snap-both'],

	// Scroll snap strictness (mandatory/proximity)
	'scroll-snap-strictness': ['snap-mandatory', 'snap-proximity'],

	// Touch action
	'touch-action': [
		'touch-auto',
		'touch-none',
		'touch-pan-x',
		'touch-pan-left',
		'touch-pan-right',
		'touch-pan-y',
		'touch-pan-up',
		'touch-pan-down',
		'touch-pinch-zoom',
		'touch-manipulation'
	],

	// User select
	'user-select': ['select-none', 'select-text', 'select-all', 'select-auto'],

	// Pointer events
	'pointer-events': ['pointer-events-none', 'pointer-events-auto'],

	// Will change
	'will-change': [
		'will-change-auto',
		'will-change-scroll',
		'will-change-contents',
		'will-change-transform'
	],

	// Appearance
	appearance: ['appearance-none', 'appearance-auto'],

	// Cursor
	cursor: [
		'cursor-auto',
		'cursor-default',
		'cursor-pointer',
		'cursor-wait',
		'cursor-text',
		'cursor-move',
		'cursor-help',
		'cursor-not-allowed',
		'cursor-none',
		'cursor-context-menu',
		'cursor-progress',
		'cursor-cell',
		'cursor-crosshair',
		'cursor-vertical-text',
		'cursor-alias',
		'cursor-copy',
		'cursor-no-drop',
		'cursor-grab',
		'cursor-grabbing',
		'cursor-all-scroll',
		'cursor-col-resize',
		'cursor-row-resize',
		'cursor-n-resize',
		'cursor-e-resize',
		'cursor-s-resize',
		'cursor-w-resize',
		'cursor-ne-resize',
		'cursor-nw-resize',
		'cursor-se-resize',
		'cursor-sw-resize',
		'cursor-ew-resize',
		'cursor-ns-resize',
		'cursor-nesw-resize',
		'cursor-nwse-resize',
		'cursor-zoom-in',
		'cursor-zoom-out'
	],

	// Fill (SVG)
	'fill-rule': ['fill-none'],

	// Stroke linecap
	'stroke-linecap': ['stroke-cap-auto', 'stroke-cap-square', 'stroke-cap-round'],

	// Stroke linejoin
	'stroke-linejoin': [
		'stroke-join-auto',
		'stroke-join-arcs',
		'stroke-join-bevel',
		'stroke-join-miter',
		'stroke-join-miter-clip',
		'stroke-join-round'
	],

	// Screen readers
	'screen-reader': ['sr-only', 'not-sr-only'],

	// Forced color adjust
	'forced-color-adjust': ['forced-color-adjust-auto', 'forced-color-adjust-none']
};

/**
 * Service for detecting conflicting Tailwind CSS utility classes.
 * Conflicting classes are utilities that set the same CSS property to different values.
 */
export class TailwindConflictDetector {
	/** Map from class name to its conflict group */
	private classToGroup: Map<string, string>;

	/** Map from conflict group to set of class names */
	private groupToClasses: Map<string, Set<string>>;

	constructor() {
		this.classToGroup = new Map();
		this.groupToClasses = new Map();

		// Build reverse lookup maps
		for (const [group, classes] of Object.entries(CONFLICT_GROUPS)) {
			const classSet = new Set(classes);
			this.groupToClasses.set(group, classSet);

			for (const className of classes) {
				this.classToGroup.set(className, group);
			}
		}
	}

	/**
	 * Get the conflict group for a class name, if any.
	 * Returns the CSS property name that this class affects.
	 */
	getConflictGroup(className: string): string | null {
		// Handle responsive/state variants by extracting base class
		// e.g., "md:text-left" -> "text-left", "hover:flex" -> "flex"
		const baseClass = this.extractBaseClass(className);
		return this.classToGroup.get(baseClass) ?? null;
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
	 * Extract the base class from a potentially prefixed class name.
	 * Handles responsive variants (sm:, md:, lg:, xl:, 2xl:) and state variants (hover:, focus:, etc.)
	 */
	private extractBaseClass(className: string): string {
		// Split by colon and take the last part (the actual utility)
		const parts = className.split(':');
		return parts[parts.length - 1];
	}

	/**
	 * Find all conflicting classes in a list of ClassNameInfo.
	 * Returns ConflictInfo for each class that conflicts with another.
	 */
	findConflicts(classNames: ClassNameInfo[]): ConflictInfo[] {
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
		// (if a class is at root and conflicts with a class in ANY branch, that's a conflict)
		for (const rootClass of rootClasses) {
			const rootGroup = this.getConflictGroup(rootClass.className);
			if (!rootGroup) continue;

			for (const branchClass of branchClasses) {
				const branchGroup = this.getConflictGroup(branchClass.className);
				if (branchGroup === rootGroup && rootClass.className !== branchClass.className) {
					// Root and branch class conflict
					conflicts.push({
						classInfo: branchClass,
						conflictsWith: [rootClass.className],
						cssProperty: rootGroup
					});
				}
			}
		}

		// 3. Find conflicts within the same branch
		// Group branch classes by their branch ID
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

		// Note: We do NOT flag conflicts between true and false branches of a ternary
		// because they are mutually exclusive at runtime

		return conflicts;
	}

	/**
	 * Find conflicts in a flat list of classes (no branch handling).
	 * Used for root classes or classes within the same branch.
	 *
	 * Classes with different prefixes (e.g., sm:text-left vs md:text-center) do NOT conflict
	 * because they apply at different breakpoints/states.
	 *
	 * All classes involved in a conflict are flagged, not just subsequent ones.
	 */
	private findConflictsInList(classes: ClassNameInfo[]): ConflictInfo[] {
		const conflicts: ConflictInfo[] = [];

		// Group classes by their conflict group AND prefix
		// Key format: "group:prefix" (e.g., "text-align:" or "text-align:md:")
		const byGroupAndPrefix = new Map<string, ClassNameInfo[]>();

		for (const classInfo of classes) {
			const group = this.getConflictGroup(classInfo.className);
			if (!group) continue;

			const prefix = this.extractPrefix(classInfo.className);
			const key = `${group}:${prefix}`;

			if (!byGroupAndPrefix.has(key)) {
				byGroupAndPrefix.set(key, []);
			}
			byGroupAndPrefix.get(key)!.push(classInfo);
		}

		// For each group+prefix with multiple classes, create conflict entries
		for (const [key, groupClasses] of byGroupAndPrefix) {
			if (groupClasses.length <= 1) continue;

			// Extract the group name from the key
			const group = key.split(':')[0];

			// Get unique base class names in this conflict (without prefix)
			const uniqueBaseClassNames = [
				...new Set(groupClasses.map(c => this.extractBaseClass(c.className)))
			];
			if (uniqueBaseClassNames.length <= 1) continue; // Same class repeated, not a conflict (handled by duplicate detection)

			// Mark ALL classes in the conflict group as conflicting
			// Each class shows what other classes it conflicts with
			for (const currentClass of groupClasses) {
				const currentBaseClass = this.extractBaseClass(currentClass.className);
				const conflictingClasses = groupClasses
					.filter(c => this.extractBaseClass(c.className) !== currentBaseClass)
					.map(c => c.className);

				// Only add if it actually conflicts with a different class
				if (conflictingClasses.length > 0) {
					conflicts.push({
						classInfo: currentClass,
						conflictsWith: [...new Set(conflictingClasses)],
						cssProperty: group
					});
				}
			}
		}

		return conflicts;
	}

	/**
	 * Check if two class names conflict with each other.
	 */
	doClassesConflict(className1: string, className2: string): boolean {
		const group1 = this.getConflictGroup(className1);
		const group2 = this.getConflictGroup(className2);

		return group1 !== null && group1 === group2 && className1 !== className2;
	}

	/**
	 * Get all classes that would conflict with a given class.
	 */
	getConflictingClasses(className: string): string[] {
		const group = this.getConflictGroup(className);
		if (!group) return [];

		const groupClasses = this.groupToClasses.get(group);
		if (!groupClasses) return [];

		return [...groupClasses].filter(c => c !== this.extractBaseClass(className));
	}
}
