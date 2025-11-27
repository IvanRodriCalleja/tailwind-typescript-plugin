/**
 * ✅ Valid: Kitchen sink from clsx docs
 * Example: clsx('foo', [1 && 'bar', { baz:false, bat:null }, ['hello', ['world']]], 'cya')
 * @validClasses [flex, items-center, justify-center, bg-blue-500, text-white]
 */
import { clsx } from 'clsx';

export function KitchenSinkValid() {
	return (
		<div
			className={clsx(
				'flex',
				[1 && 'items-center', { 'justify-center': false, 'bg-blue-500': null }, ['text-white']],
				'text-white'
			)}>
			Kitchen sink
		</div>
	);
}
