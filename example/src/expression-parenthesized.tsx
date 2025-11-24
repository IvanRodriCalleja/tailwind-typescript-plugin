/**
 * E2E Test: Parenthesized Expressions
 * Context: Parenthesized expressions and type assertions
 * Pattern: Expressions wrapped in parentheses or with type assertions
 *
 * Tests validation of: className={(expr)}, className={expr as string}, className={expr!}
 */

// ========================================
// PARENTHESIZED STRING LITERALS
// ========================================

/**
 * ✅ Valid: Parenthesized string literal
 * @validClasses [flex, items-center]
 */
export function ParenthesizedStringLiteral() {
	return <div className={'flex items-center'}>Parenthesized string</div>;
}

/**
 * ❌ Invalid: Parenthesized invalid class
 * @invalidClasses [invalid-class]
 */
export function ParenthesizedInvalidClass() {
	return <div className={'invalid-class'}>Parenthesized invalid</div>;
}

/**
 * ❌ Invalid: Parenthesized mixed valid and invalid
 * @invalidClasses [invalid-class]
 * @validClasses [flex]
 */
export function ParenthesizedMixed() {
	return <div className={'flex invalid-class'}>Parenthesized mixed</div>;
}

// ========================================
// PARENTHESIZED TERNARY EXPRESSIONS
// ========================================

/**
 * ✅ Valid: Parenthesized ternary
 * @validClasses [bg-red-500, bg-blue-500]
 */
export function ParenthesizedTernary() {
	const isError = true;
	return <div className={isError ? 'bg-red-500' : 'bg-blue-500'}>Parenthesized ternary</div>;
}

/**
 * ❌ Invalid: Parenthesized ternary with invalid class
 * @invalidClasses [invalid-class]
 * @validClasses [bg-blue-500]
 */
export function ParenthesizedTernaryInvalid() {
	const isError = true;
	return <div className={isError ? 'invalid-class' : 'bg-blue-500'}>Invalid in ternary</div>;
}

// ========================================
// PARENTHESIZED BINARY EXPRESSIONS
// ========================================

/**
 * ✅ Valid: Parenthesized binary expression
 * @validClasses [bg-red-500]
 */
export function ParenthesizedBinary() {
	const isError = true;
	return <div className={isError && 'bg-red-500'}>Parenthesized binary</div>;
}

/**
 * ❌ Invalid: Parenthesized binary with invalid class
 * @invalidClasses [invalid-class]
 */
export function ParenthesizedBinaryInvalid() {
	const isError = true;
	return <div className={isError && 'invalid-class'}>Invalid in binary</div>;
}

// ========================================
// NESTED PARENTHESES
// ========================================

/**
 * ✅ Valid: Nested parentheses
 * @validClasses [bg-green-500, bg-gray-500]
 */
export function NestedParentheses() {
	const isActive = true;
	return <div className={isActive ? 'bg-green-500' : 'bg-gray-500'}>Nested parentheses</div>;
}

/**
 * ❌ Invalid: Nested parentheses with invalid class
 * @invalidClasses [invalid-class]
 * @validClasses [bg-gray-500]
 */
export function NestedParenthesesInvalid() {
	const isActive = true;
	return <div className={isActive ? 'invalid-class' : 'bg-gray-500'}>Nested invalid</div>;
}

// ========================================
// TYPE ASSERTIONS WITH 'as'
// ========================================

/**
 * ✅ Valid: Type assertion with 'as string'
 * @validClasses [flex, items-center]
 */
export function TypeAssertionAsString() {
	return <div className={'flex items-center' as string}>Type assertion as string</div>;
}

/**
 * ✅ Valid: Type assertion with 'as const'
 * @validClasses [bg-blue-500]
 */
export function TypeAssertionAsConst() {
	return <div className={'bg-blue-500' as const}>Type assertion as const</div>;
}

/**
 * ❌ Invalid: Type assertion with invalid class
 * @invalidClasses [invalid-class]
 */
export function TypeAssertionInvalid() {
	return <div className={'invalid-class' as string}>Type assertion invalid</div>;
}

/**
 * ❌ Invalid: Type assertion with mixed classes
 * @invalidClasses [invalid-class]
 * @validClasses [flex]
 */
export function TypeAssertionMixed() {
	return <div className={'flex invalid-class' as string}>Type assertion mixed</div>;
}

// ========================================
// NON-NULL ASSERTIONS
// ========================================

/**
 * ✅ Valid: Non-null assertion
 * @validClasses [flex, items-center]
 */
export function NonNullAssertion() {
	const className: string | null = 'flex items-center';
	return <div className={className!}>Non-null assertion</div>;
}

/**
 * ❌ Invalid: Non-null assertion with invalid class
 * @invalidClasses [invalid-class]
 */
export function NonNullAssertionInvalid() {
	const className: string | null = 'invalid-class';
	return <div className={className!}>Non-null invalid</div>;
}

// ========================================
// COMPLEX COMBINATIONS
// ========================================

/**
 * ✅ Valid: Parenthesized with clsx
 * @validClasses [flex, bg-blue-500]
 */
export function ParenthesizedWithClsx() {
	const isActive = true;
	return <div className={clsx('flex', isActive && 'bg-blue-500')}>Parenthesized clsx</div>;
}

/**
 * ❌ Invalid: Parenthesized clsx with invalid class
 * @invalidClasses [invalid-class]
 * @validClasses [flex]
 */
export function ParenthesizedWithClsxInvalid() {
	const isActive = true;
	return <div className={clsx('flex', isActive && 'invalid-class')}>Invalid in clsx</div>;
}

/**
 * ✅ Valid: Type assertion on ternary
 * @validClasses [bg-red-500, bg-blue-500]
 */
export function TypeAssertionOnTernary() {
	const isError = true;
	return (
		<div className={(isError ? 'bg-red-500' : 'bg-blue-500') as string}>
			Type assertion on ternary
		</div>
	);
}

/**
 * ❌ Invalid: Type assertion on ternary with invalid
 * @invalidClasses [invalid-class]
 * @validClasses [bg-blue-500]
 */
export function TypeAssertionOnTernaryInvalid() {
	const isError = true;
	return (
		<div className={(isError ? 'invalid-class' : 'bg-blue-500') as string}>
			Invalid in ternary with assertion
		</div>
	);
}

/**
 * ✅ Valid: Combination of parentheses and type assertion
 * @validClasses [flex, items-center, justify-center]
 */
export function ParenthesesAndTypeAssertion() {
	return <div className={'flex items-center justify-center' as string}>Combined</div>;
}

/**
 * ❌ Invalid: Combination with invalid class
 * @invalidClasses [invalid-class]
 * @validClasses [flex]
 */
export function ParenthesesAndTypeAssertionInvalid() {
	return <div className={'flex invalid-class' as string}>Combined invalid</div>;
}

declare function clsx(...args: any[]): string;
