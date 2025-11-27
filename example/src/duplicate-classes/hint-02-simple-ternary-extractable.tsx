const isActive = true;

/**
 * 💡 Hint: Simple ternary without utility function
 * @extractableClasses [flex, flex]
 */
export function SimpleTernaryExtractable() {
	return (
		<div className={isActive ? 'flex bg-blue-500' : 'flex bg-gray-500'}>
			Simple ternary extractable
		</div>
	);
}
