/**
 * ✅ Valid: Deep member expression
 * @validClasses [flex, items-center]
 */
export function DeepMemberExpression() {
	return <div className={lib.utils.cn('flex', 'items-center')}>Deep member expression</div>;
}

declare const lib: {
	utils: {
		cn(...args: string[]): string;
	};
};
