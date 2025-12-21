/**
 * ❌ Invalid: Deep complex nesting with invalid
 * @invalidClasses [invalid-deep]
 * @validClasses [flex, items-center, justify-center, bg-blue-500, text-white, font-bold]
 */
import { clsx } from 'clsx';

const isActive = true;

export function DeepComplexNestingInvalid() {
	return (
		<div
			className={clsx('flex', [
				isActive && 'items-center',
				[
					['justify-center', isActive ? 'bg-blue-500' : 'bg-gray-500'],
					{ 'text-white': true, 'font-bold': ['invalid-deep'] }
				]
			])}>
			Invalid deep
		</div>
	);
}
