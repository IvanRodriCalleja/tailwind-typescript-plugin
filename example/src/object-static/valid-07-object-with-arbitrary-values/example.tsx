import clsx from 'clsx';

// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ✅ Valid: Object with arbitrary values
 * @validClasses [h-[50vh], w-[100px], bg-[#ff0000]]
 */
export function ObjectWithArbitraryValues() {
	return (
		<div className={clsx({ 'h-[50vh]': true, 'w-[100px]': true, 'bg-[#ff0000]': isActive })}>
			Arbitrary values
		</div>
	);
}
