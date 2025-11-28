/**
 * ❌ Invalid: Wrong prefix - mycustom doesn't match custom-*
 * @invalidClasses [mycustom-button]
 */
export function WrongPrefix() {
	return <div className="mycustom-button">Wrong prefix</div>;
}
