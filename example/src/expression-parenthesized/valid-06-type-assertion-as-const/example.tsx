/**
 * ✅ Valid: Type assertion with 'as const'
 * @validClasses [bg-blue-500]
 */
export function TypeAssertionAsConst() {
	return <div className={'bg-blue-500' as const}>Type assertion as const</div>;
}
