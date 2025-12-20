/**
 * ✅ Valid: With arbitrary values in complex nesting
 * @validClasses [flex, h-[50vh], w-[100px], bg-[#ff0000], p-[20px]]
 */
import { clsx } from 'clsx';

export function ComplexWithArbitrary() {
	return (
		<div className={clsx('flex', { 'h-[50vh]': ['w-[100px]', 'bg-[#ff0000]'] }, [['p-[20px]']])}>
			Complex with arbitrary
		</div>
	);
}
