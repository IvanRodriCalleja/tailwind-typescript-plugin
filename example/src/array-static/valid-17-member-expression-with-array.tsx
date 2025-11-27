/**
 * ✅ Valid: Member expression with array
 * @validClasses [flex, items-center, justify-center]
 */
export function MemberExpressionWithArray() {
	return (
		<div className={utils.cn(['flex', 'items-center', 'justify-center'])}>Member with array</div>
	);
}

declare const utils: {
	cn(...args: (string | string[])[]): string;
};
