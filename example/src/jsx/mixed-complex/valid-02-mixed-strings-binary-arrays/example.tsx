/**
 * ✅ Valid: Mix of strings, binary, and nested arrays
 * @validClasses [flex, items-center, justify-center, bg-blue-500, text-white]
 */
import { cn } from '../utils';

const isActive = true;

export function MixedStringsBinaryArrays() {
	return (
		<div
			className={cn(
				'flex',
				isActive && 'items-center',
				[['justify-center', 'bg-blue-500']],
				'text-white'
			)}>
			Mixed types
		</div>
	);
}
