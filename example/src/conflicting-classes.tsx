// ========================================
// TAILWIND-VARIANTS (tv)
// ========================================
// ========================================
// CLASS-VARIANCE-AUTHORITY (cva)
// ========================================
import { cva } from 'class-variance-authority';
import { tv } from 'tailwind-variants';

/**
 * E2E Test: Conflicting Class Detection
 * Context: literal (plain string) and expressions
 * Pattern: conflicting (classes that affect the same CSS property)
 *
 * Tests validation of conflicting Tailwind classes within className attributes.
 * Conflicts should show as WARNINGS when two classes set the same CSS property.
 */

// TEXT ALIGNMENT CONFLICTS

/**
 * Warning: Conflicting text alignment classes
 * @conflictClasses [text-center]
 * Both text-left and text-center set text-align property
 */
export function TextAlignConflict() {
	return <div className="text-left text-center">Text alignment conflict</div>;
}

/**
 * Warning: Multiple text alignment conflicts
 * @conflictClasses [text-center, text-right]
 * All three set the same property - text-align
 */
export function MultipleTextAlignConflicts() {
	return <div className="text-left text-center text-right">Multiple text-align conflicts</div>;
}

/**
 * Warning: text-justify vs text-left conflict
 * @conflictClasses [text-justify]
 */
export function TextJustifyConflict() {
	return <div className="text-left text-justify">Text justify conflict</div>;
}

// DISPLAY CONFLICTS

/**
 * Warning: flex vs block conflict
 * @conflictClasses [block]
 * Both set the display property
 */
export function FlexBlockConflict() {
	return <div className="flex block">Flex vs block conflict</div>;
}

/**
 * Warning: grid vs flex conflict
 * @conflictClasses [flex]
 */
export function GridFlexConflict() {
	return <div className="grid flex">Grid vs flex conflict</div>;
}

/**
 * Warning: hidden conflicts with flex
 * @conflictClasses [hidden]
 * hidden sets display: none
 */
export function HiddenFlexConflict() {
	return <div className="flex hidden">Hidden vs flex conflict</div>;
}

/**
 * Warning: inline-block vs block conflict
 * @conflictClasses [block]
 */
export function InlineBlockConflict() {
	return <div className="inline-block block">Inline-block vs block conflict</div>;
}

// ========================================
// POSITION CONFLICTS
// ========================================

/**
 * Warning: absolute vs relative conflict
 * @conflictClasses [relative]
 * Both set the position property
 */
export function AbsoluteRelativeConflict() {
	return <div className="absolute relative">Absolute vs relative conflict</div>;
}

/**
 * Warning: sticky vs fixed conflict
 * @conflictClasses [fixed]
 */
export function StickyFixedConflict() {
	return <div className="sticky fixed">Sticky vs fixed conflict</div>;
}

/**
 * Warning: static vs absolute conflict
 * @conflictClasses [absolute]
 */
export function StaticAbsoluteConflict() {
	return <div className="static absolute">Static vs absolute conflict</div>;
}

// ========================================
// FLEX DIRECTION CONFLICTS
// ========================================

/**
 * Warning: flex-row vs flex-col conflict
 * @conflictClasses [flex-col]
 */
export function FlexDirectionConflict() {
	return <div className="flex flex-row flex-col">Flex direction conflict</div>;
}

/**
 * Warning: flex-row-reverse vs flex-col conflict
 * @conflictClasses [flex-col]
 */
export function FlexReverseConflict() {
	return <div className="flex flex-row-reverse flex-col">Flex reverse conflict</div>;
}

// ========================================
// JUSTIFY CONTENT CONFLICTS
// ========================================

/**
 * Warning: justify-start vs justify-center conflict
 * @conflictClasses [justify-center]
 */
export function JustifyContentConflict() {
	return <div className="flex justify-start justify-center">Justify content conflict</div>;
}

/**
 * Warning: justify-between vs justify-around conflict
 * @conflictClasses [justify-around]
 */
export function JustifyBetweenAroundConflict() {
	return (
		<div className="flex justify-between justify-around">Justify between vs around conflict</div>
	);
}

// ========================================
// ALIGN ITEMS CONFLICTS
// ========================================

/**
 * Warning: items-start vs items-center conflict
 * @conflictClasses [items-center]
 */
export function AlignItemsConflict() {
	return <div className="flex items-start items-center">Align items conflict</div>;
}

/**
 * Warning: items-stretch vs items-baseline conflict
 * @conflictClasses [items-baseline]
 */
export function ItemsStretchBaselineConflict() {
	return (
		<div className="flex items-stretch items-baseline">Items stretch vs baseline conflict</div>
	);
}

// ========================================
// VISIBILITY CONFLICTS
// ========================================

/**
 * Warning: visible vs invisible conflict
 * @conflictClasses [invisible]
 */
export function VisibilityConflict() {
	return <div className="visible invisible">Visibility conflict</div>;
}

// ========================================
// OVERFLOW CONFLICTS
// ========================================

/**
 * Warning: overflow-hidden vs overflow-scroll conflict
 * @conflictClasses [overflow-scroll]
 */
export function OverflowConflict() {
	return <div className="overflow-hidden overflow-scroll">Overflow conflict</div>;
}

/**
 * Warning: overflow-auto vs overflow-visible conflict
 * @conflictClasses [overflow-visible]
 */
export function OverflowAutoVisibleConflict() {
	return <div className="overflow-auto overflow-visible">Overflow auto vs visible conflict</div>;
}

// ========================================
// FONT STYLE CONFLICTS
// ========================================

/**
 * Warning: italic vs not-italic conflict
 * @conflictClasses [not-italic]
 */
export function FontStyleConflict() {
	return <div className="italic not-italic">Font style conflict</div>;
}

// ========================================
// TEXT TRANSFORM CONFLICTS
// ========================================

/**
 * Warning: uppercase vs lowercase conflict
 * @conflictClasses [lowercase]
 */
export function TextTransformConflict() {
	return <div className="uppercase lowercase">Text transform conflict</div>;
}

/**
 * Warning: capitalize vs normal-case conflict
 * @conflictClasses [normal-case]
 */
export function CapitalizeNormalConflict() {
	return <div className="capitalize normal-case">Capitalize vs normal-case conflict</div>;
}

// ========================================
// WHITESPACE CONFLICTS
// ========================================

/**
 * Warning: whitespace-nowrap vs whitespace-normal conflict
 * @conflictClasses [whitespace-normal]
 */
export function WhitespaceConflict() {
	return <div className="whitespace-nowrap whitespace-normal">Whitespace conflict</div>;
}

// ========================================
// TEXT WRAP CONFLICTS
// ========================================

/**
 * Warning: text-wrap vs text-nowrap conflict
 * @conflictClasses [text-nowrap]
 */
export function TextWrapConflict() {
	return <div className="text-wrap text-nowrap">Text wrap conflict</div>;
}

// ========================================
// CURSOR CONFLICTS
// ========================================

/**
 * Warning: cursor-pointer vs cursor-not-allowed conflict
 * @conflictClasses [cursor-not-allowed]
 */
export function CursorConflict() {
	return <div className="cursor-pointer cursor-not-allowed">Cursor conflict</div>;
}

// ========================================
// NO FALSE POSITIVES (Valid cases)
// ========================================

/**
 * Valid: Different utility types - no conflicts
 * @validClasses [flex, items-center, justify-between, p-4, bg-white]
 */
export function NoConflicts() {
	return <div className="flex items-center justify-between p-4 bg-white">No conflicts</div>;
}

/**
 * Valid: Same class in different elements - no conflict
 * @validClasses [text-left, text-center]
 */
export function SameClassDifferentElements() {
	return (
		<div className="text-left">
			<span className="text-center">Same utility, different elements</span>
		</div>
	);
}

/**
 * Valid: Similar but non-conflicting classes
 * p-4 and pt-4 affect different properties (padding vs padding-top)
 * @validClasses [p-4, pt-8]
 */
export function SimilarButNotConflicting() {
	return <div className="p-4 pt-8">Similar but not conflicting</div>;
}

/**
 * Valid: Duplicate (same class) is not a conflict
 * This triggers duplicate detection, not conflict detection
 * @duplicateClasses [flex]
 */
export function DuplicateNotConflict() {
	return <div className="flex flex items-center">Duplicate, not conflict</div>;
}

// ========================================
// RESPONSIVE VARIANTS
// ========================================

/**
 * Warning: Conflicts with same responsive variant
 * @conflictClasses [md:text-center]
 */
export function ResponsiveConflict() {
	return <div className="md:text-left md:text-center">Responsive conflict</div>;
}

/**
 * Valid: Different responsive variants - no conflict
 * sm:text-left and md:text-center apply at different breakpoints
 * @validClasses [sm:text-left, md:text-center]
 */
export function DifferentBreakpoints() {
	return <div className="sm:text-left md:text-center">Different breakpoints - no conflict</div>;
}

/**
 * Warning: Conflicts with same state variant
 * @conflictClasses [hover:flex]
 */
export function StateVariantConflict() {
	return <div className="hover:block hover:flex">State variant conflict</div>;
}

// ========================================
// TERNARY CONDITIONAL EXPRESSIONS
// ========================================

const isActive = true;

/**
 * Valid: Conflicting classes in DIFFERENT ternary branches - no conflict
 * text-left in true branch, text-center in false branch are mutually exclusive
 */
export function TernaryMutuallyExclusive() {
	return (
		<div className={isActive ? 'text-left' : 'text-center'}>
			Ternary mutually exclusive - no conflict
		</div>
	);
}

/**
 * Warning: Root class conflicts with branch class
 * @conflictClasses [text-center]
 */
export function RootConflictWithBranch() {
	return (
		<div className={clsx('text-left', isActive && 'text-center')}>Root conflicts with branch</div>
	);
}

/**
 * Warning: Conflicts WITHIN same ternary branch
 * @conflictClasses [text-center]
 * Both text-left and text-center are in the true branch
 */
export function ConflictWithinSameBranch() {
	return (
		<div className={isActive ? 'text-left text-center' : 'text-right'}>
			Conflict within same branch
		</div>
	);
}

// ========================================
// UTILITY FUNCTION CALLS
// ========================================

/**
 * Warning: Conflict in clsx arguments
 * @conflictClasses [block]
 */
export function ConflictInClsx() {
	return <div className={clsx('flex', 'block', 'items-center')}>Conflict in clsx</div>;
}

/**
 * Warning: Conflict in cn function
 * @conflictClasses [text-right]
 */
export function ConflictInCn() {
	return <div className={cn('text-left text-right items-center')}>Conflict in cn</div>;
}

// ========================================

// ========================================
// TV() CONFLICTS
// ========================================

/**
 * Warning: Conflict in tv() base
 * @conflictClasses [flex, block]
 */
export function TvBaseConflict() {
	const button = tv({
		base: 'flex block items-center'
	});
	return <button className={button()}>TV base conflict</button>;
}

/**
 * Valid: No conflict between tv() base and variants
 * Variants are designed to override base styles, so this is intentional
 */
export function TvBaseVariantNoConflict() {
	const button = tv({
		base: 'text-left items-center',
		variants: {
			align: {
				center: 'text-center'
			}
		}
	});
	return <button className={button({ align: 'center' })}>TV base+variant no conflict</button>;
}

/**
 * Valid: No conflict between different tv() calls
 */
export function TvDifferentCallsNoConflict() {
	const tvButton = tv({
		base: 'text-left'
	});
	const tvCard = tv({
		base: 'text-center'
	});
	return (
		<>
			<button className={tvButton()}>Button</button>
			<div className={tvCard()}>Card</div>
		</>
	);
}

// ========================================
// CVA() CONFLICTS
// ========================================

/**
 * Warning: Conflict in cva() base array
 * @conflictClasses [flex, grid]
 */
export function CvaBaseConflict() {
	const button = cva(['flex', 'grid', 'items-center']);
	return <button className={button()}>CVA base conflict</button>;
}

/**
 * Valid: No conflict between cva() base and variants
 * Variants are designed to override base styles, so this is intentional
 */
export function CvaBaseVariantNoConflict() {
	const button = cva(['justify-start'], {
		variants: {
			centered: {
				true: ['justify-center']
			}
		}
	});
	return <button className={button({ centered: true })}>CVA base+variant no conflict</button>;
}

// ========================================
// COMBINED WITH OTHER ISSUES
// ========================================

/**
 * Error + Conflict: Both invalid class and conflict
 * @invalidClasses [invalidclass]
 * @conflictClasses [block]
 */
export function InvalidAndConflict() {
	return <div className="flex invalidclass block items-center">Invalid and conflict</div>;
}

/**
 * Duplicate + Conflict: Both duplicate and conflict
 * @duplicateClasses [flex]
 * @conflictClasses [block]
 */
export function DuplicateAndConflict() {
	return <div className="flex flex block items-center">Duplicate and conflict</div>;
}

// Stub declarations for utility functions used in examples
declare function clsx(...args: unknown[]): string;
declare function cn(...args: unknown[]): string;
