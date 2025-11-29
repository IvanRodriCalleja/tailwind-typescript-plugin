/**
 * ✅ Valid: Combination of parentheses and type assertion
 * @validClasses [flex, items-center, justify-center]
 */
export function ParenthesesAndTypeAssertion() {
	return <div className={'flex items-center justify-center' as string}>Combined</div>;
}
