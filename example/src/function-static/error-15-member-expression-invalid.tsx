/**
 * ❌ Invalid: Member expression with invalid class
 * @invalidClasses [invalid-class]
 * @validClasses [flex, items-center]
 */
export function MemberExpressionInvalid() {
	return (
		<div className={utils.cn('flex', 'invalid-class', 'items-center')}>
			Member expression with invalid
		</div>
	);
}

declare const utils: {
	cn(...args: string[]): string;
};
