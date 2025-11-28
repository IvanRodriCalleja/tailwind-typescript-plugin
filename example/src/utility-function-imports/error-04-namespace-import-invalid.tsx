/**
 * ❌ Invalid: Namespace import with invalid class
 * @utilityFunctions [{"name": "clsx", "from": "clsx"}]
 * @invalidClasses [not-valid-class]
 * @validClasses [flex, items-center]
 */
import * as utils from 'clsx';

export function NamespaceImportInvalid() {
	return (
		<div className={utils.clsx('flex', 'items-center', 'not-valid-class')}>
			Namespace import with invalid class
		</div>
	);
}
