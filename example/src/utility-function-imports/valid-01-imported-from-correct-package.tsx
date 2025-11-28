/**
 * ✅ Valid: Function imported from the correct package with valid classes
 * @utilityFunctions [{"name": "merge", "from": "@/lib/utils"}]
 * @validClasses [flex, items-center, justify-center]
 */
import { merge } from '@/lib/utils';

export function ImportedFromCorrectPackage() {
	return (
		<div className={merge('flex', 'items-center', 'justify-center')}>
			Imported from correct package
		</div>
	);
}
