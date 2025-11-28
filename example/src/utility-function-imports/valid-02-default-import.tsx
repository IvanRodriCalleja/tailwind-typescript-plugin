/**
 * ✅ Valid: Default import from the correct package with valid classes
 * @utilityFunctions [{"name": "classBuilder", "from": "my-class-builder"}]
 * @validClasses [flex, gap-4, p-4]
 */
import classBuilder from 'my-class-builder';

export function DefaultImportValid() {
	return (
		<div className={classBuilder('flex', 'gap-4', 'p-4')}>
			Default import
		</div>
	);
}
