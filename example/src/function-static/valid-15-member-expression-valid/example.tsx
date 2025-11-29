/**
 * ✅ Valid: Member expression with valid classes
 * @validClasses [flex, items-center, justify-center]
 */
export function MemberExpressionValid() {
	return (
		<div className={utils.cn('flex', 'items-center', 'justify-center')}>
			Member expression valid
		</div>
	);
}

declare const utils: {
	cn(...args: string[]): string;
};
