/**
 * ✅ Valid: Function not imported from specified package is NOT validated (ignored)
 * This tests that when a function has the right name but wrong import, it's skipped
 * @utilityFunctions [{"name": "merge", "from": "some-other-package"}]
 * @validClasses []
 */
import { merge } from '@/different/package';

export function NotImportedNotValidated() {
	// This merge is from @/different/package, not some-other-package
	// So it should NOT be validated and the invalid-class should be ignored
	return (
		<div className={merge('flex', 'invalid-class-here')}>Wrong import source - not validated</div>
	);
}
