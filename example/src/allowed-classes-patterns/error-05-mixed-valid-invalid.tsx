/**
 * ❌ Invalid: Mix of valid patterns and invalid class
 * @invalidClasses [not-allowed]
 * @validClasses [custom-header, close-icon]
 */
export function MixedValidInvalid() {
	return <div className="custom-header close-icon not-allowed">Mixed</div>;
}
