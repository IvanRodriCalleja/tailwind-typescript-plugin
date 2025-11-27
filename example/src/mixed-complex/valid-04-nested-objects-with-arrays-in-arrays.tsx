/**
 * ✅ Valid: Nested objects with array values inside arrays
 * @validClasses [flex, items-center, justify-center, bg-blue-500, text-white, font-bold]
 */
import { cn } from '../utils';

const isActive = true;

export function NestedObjectsWithArraysInArrays() {
	return (
		<div
			className={cn([
				'flex',
				{ 'items-center': ['justify-center', 'bg-blue-500'] },
				[{ 'text-white': true, 'font-bold': isActive }]
			])}>
			Nested complex
		</div>
	);
}
