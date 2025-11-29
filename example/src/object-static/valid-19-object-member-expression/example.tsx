// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ✅ Valid: Member expression with object
 * @validClasses [flex, items-center, justify-center]
 */
export function ObjectMemberExpression() {
	return (
		<div className={utils.clsx({ flex: true, 'items-center': true, 'justify-center': isActive })}>
			Member with object
		</div>
	);
}

declare const utils: {
	clsx(...args: unknown[]): string;
};
