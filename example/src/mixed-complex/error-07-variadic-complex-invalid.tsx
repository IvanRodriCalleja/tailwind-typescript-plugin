/**
 * ❌ Invalid: Variadic complex with invalid
 * @invalidClasses [invalid-variadic]
 * @validClasses [flex, items-center, justify-center, bg-blue-500, font-bold]
 */
import { cn } from '../utils';

export function VariadicComplexInvalid() {
	return (
		<div
			className={cn(
				['flex'],
				['items-center'],
				[['justify-center', [['bg-blue-500'], 'invalid-variadic']]],
				'font-bold'
			)}>
			Invalid variadic
		</div>
	);
}
