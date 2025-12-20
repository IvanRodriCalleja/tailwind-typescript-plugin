/**
 * Valid: Custom attribute with clsx utility function
 * @validClasses [bg-blue-500, text-white, font-bold]
 */
import { clsx } from 'clsx';

const isActive = true;

export function CustomWithClsx() {
	return (
		<View colorStyles={clsx('bg-blue-500', isActive && 'text-white', { 'font-bold': true })}>
			Hello
		</View>
	);
}
