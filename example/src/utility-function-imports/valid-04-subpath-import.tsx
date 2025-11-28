/**
 * ✅ Valid: Import from package subpath with valid classes
 * @utilityFunctions [{"name": "styles", "from": "my-library"}]
 * @validClasses [flex, flex-col, gap-2]
 */
import { styles } from 'my-library/utils';

export function SubpathImportValid() {
	return (
		<div className={styles('flex', 'flex-col', 'gap-2')}>
			Subpath import matches parent package
		</div>
	);
}
