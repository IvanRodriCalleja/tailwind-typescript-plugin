const isActive = true;

/**
 * 💡 Hint: Multiple extractable classes in ternary
 * @extractableClasses [flex, flex, items-center, items-center]
 * Both 'flex' and 'items-center' appear in both branches (4 hints total)
 */
export function MultipleExtractableClasses() {
	return (
		<div className={isActive ? 'flex items-center p-4' : 'flex items-center m-4'}>
			Multiple extractable classes
		</div>
	);
}
