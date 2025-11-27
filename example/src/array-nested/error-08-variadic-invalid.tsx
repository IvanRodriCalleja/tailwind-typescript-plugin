import { cn } from '../utils';

/**
 * ❌ Invalid: Variadic nested arrays with invalid
 * @invalidClasses [invalid-variadic]
 * @validClasses [flex, items-center, justify-center, bg-blue-500]
 */
export function NestedArrayVariadicInvalid() {
	return (
		<div
			className={cn(
				['flex'],
				['items-center'],
				[['justify-center', [['bg-blue-500'], 'invalid-variadic']]]
			)}>
			Invalid variadic
		</div>
	);
}
