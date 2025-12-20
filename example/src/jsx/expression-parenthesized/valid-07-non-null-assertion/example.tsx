/**
 * ✅ Valid: Non-null assertion
 * @validClasses [flex, items-center]
 */
export function NonNullAssertion() {
	const className: string | null = 'flex items-center';
	return <div className={className!}>Non-null assertion</div>;
}
