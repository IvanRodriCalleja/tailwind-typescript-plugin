/**
 * ✅ Valid: Namespace import with member expression
 * @utilityFunctions [{"name": "clsx", "from": "clsx"}]
 * @validClasses [flex, items-center, gap-4]
 */
import * as utils from 'clsx';

export function NamespaceImportValid() {
	return (
		<div className={utils.clsx('flex', 'items-center', 'gap-4')}>
			Namespace import with member expression
		</div>
	);
}
