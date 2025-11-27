/**
 * ✅ Valid: Multiple levels of nesting with all patterns
 * @validClasses [flex, items-center, justify-center, bg-blue-500, text-white, font-bold, hover:bg-red-500]
 */
import { clsx } from 'clsx';

const isActive = true;

export function DeepComplexNesting() {
	return (
		<div
			className={clsx('flex', [
				isActive && 'items-center',
				[
					['justify-center', isActive ? 'bg-blue-500' : 'bg-gray-500'],
					{ 'text-white': true, 'font-bold': ['hover:bg-red-500'] }
				]
			])}>
			Deep complex
		</div>
	);
}
