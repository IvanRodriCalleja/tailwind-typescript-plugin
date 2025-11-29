/**
 * ❌ Invalid: Member expression with invalid in array
 * @invalidClasses [invalid-class]
 * @validClasses [flex, items-center]
 */
export function MemberExpressionWithArrayInvalid() {
	return (
		<div className={utils.cn(['flex', 'invalid-class', 'items-center'])}>Member with invalid</div>
	);
}

declare const utils: {
	cn(...args: (string | string[])[]): string;
};
