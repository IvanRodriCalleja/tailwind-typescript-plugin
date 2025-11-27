import { cn } from '../utils';

/**
 * ✅ Valid: Nested arrays with arbitrary values
 * @validClasses [flex, h-[50vh], w-[100px], bg-[#ff0000]]
 */
export function NestedArrayWithArbitrary() {
	return (
		<div
			className={cn([
				['flex', 'h-[50vh]'],
				['w-[100px]', 'bg-[#ff0000]']
			])}>
			With arbitrary
		</div>
	);
}
