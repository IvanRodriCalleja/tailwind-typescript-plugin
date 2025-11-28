import { cn } from '../utils';

/**
 * ❌ Invalid: Mixed spreads with valid and invalid classes
 * @invalidClasses [invalid-mixed-class, another-invalid]
 */
export function TestMixedSpreadInvalid() {
	const validClasses = ['flex', 'items-center'];
	const invalidClasses = ['invalid-mixed-class', 'another-invalid'];
	return <div className={cn(...validClasses, 'p-4', ...invalidClasses)}>Mixed spread invalid</div>;
}
