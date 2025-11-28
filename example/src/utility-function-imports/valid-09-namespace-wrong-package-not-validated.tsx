/**
 * ✅ Valid: Namespace import from wrong package is NOT validated (ignored)
 * @utilityFunctions [{"name": "clsx", "from": "clsx"}]
 * @validClasses []
 */
import * as utils from 'other-package';

export function NamespaceWrongPackageNotValidated() {
	// This utils.clsx is from 'other-package', not 'clsx'
	// So it should NOT be validated and the invalid-class should be ignored
	return (
		<div className={utils.clsx('flex', 'invalid-should-be-ignored')}>
			Wrong namespace import - not validated
		</div>
	);
}
