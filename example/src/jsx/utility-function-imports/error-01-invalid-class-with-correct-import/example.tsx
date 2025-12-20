/**
 * ❌ Invalid: Function imported from correct package with invalid class
 * @utilityFunctions [{"name": "combine", "from": "@/lib/styles"}]
 * @invalidClasses [invalid-tailwind-class]
 * @validClasses [flex, items-center]
 */
import { combine } from '@/lib/styles';

export function InvalidClassWithCorrectImport() {
	return (
		<div className={combine('flex', 'items-center', 'invalid-tailwind-class')}>
			Correct import - should validate and find error
		</div>
	);
}
