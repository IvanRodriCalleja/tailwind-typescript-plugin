/**
 * ✅ Valid: Type assertion with 'as string'
 * @validClasses [flex, items-center]
 */
export function TypeAssertionAsString() {
	return <div className={'flex items-center' as string}>Type assertion as string</div>;
}
