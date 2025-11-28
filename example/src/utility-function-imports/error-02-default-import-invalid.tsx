/**
 * ❌ Invalid: Default import from correct package with invalid class
 * @utilityFunctions [{"name": "styles", "from": "my-styles-pkg"}]
 * @invalidClasses [not-a-valid-class]
 * @validClasses [p-4]
 */
import styles from 'my-styles-pkg';

export function DefaultImportInvalid() {
	return (
		<div className={styles('p-4', 'not-a-valid-class')}>Default import with invalid class</div>
	);
}
