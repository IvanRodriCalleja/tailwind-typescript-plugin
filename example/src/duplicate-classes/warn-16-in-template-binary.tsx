const hasError = true;

/**
 * ⚠️ Warning: Duplicate in template binary
 * @duplicateClasses [border, border]
 */
export function DuplicateInTemplateBinary() {
	return (
		<div className={`flex border ${hasError && 'border text-red-500'}`}>
			Duplicate in template binary
		</div>
	);
}
