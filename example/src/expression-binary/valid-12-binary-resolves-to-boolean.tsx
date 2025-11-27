/**
 * ✅ Valid: Binary that resolves to boolean (falsy case)
 */
export function BinaryResolvesToBoolean() {
	return <div className={true && 'text-red-500'}>Boolean result</div>;
}
