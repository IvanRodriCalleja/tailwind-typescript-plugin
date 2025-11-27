/**
 * ❌ Invalid: Kitchen sink with invalid class
 * @invalidClasses [invalid-class]
 * @validClasses [flex, items-center, justify-center, text-white]
 */
import { clsx } from 'clsx';

export function KitchenSinkInvalid() {
	return (
		<div
			className={clsx(
				'flex',
				[1 && 'items-center', { 'justify-center': false, 'invalid-class': null }, ['text-white']],
				'text-white'
			)}>
			Invalid kitchen sink
		</div>
	);
}
