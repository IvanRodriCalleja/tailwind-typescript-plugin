/**
 * Error: Invalid class in custom attribute with clsx
 * @invalidClasses [invalid-class]
 */
import { clsx } from 'clsx';

const isActive = true;

export function CustomWithClsxInvalid() {
	return (
		<View colorStyles={clsx('bg-blue-500', isActive && 'invalid-class', { 'font-bold': true })}>
			Hello
		</View>
	);
}
