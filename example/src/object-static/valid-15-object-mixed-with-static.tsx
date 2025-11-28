import clsx from 'clsx';

// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ✅ Valid: Mix of object and static strings
 * @validClasses [flex, items-center, justify-center, bg-blue-500]
 */
export function ObjectMixedWithStatic() {
	return (
		<div
			className={clsx('flex', { 'items-center': true, 'justify-center': isActive }, 'bg-blue-500')}>
			Mixed with static
		</div>
	);
}

