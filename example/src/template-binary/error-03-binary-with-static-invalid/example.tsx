// Simulate dynamic values that might come from props or state
const isError = false;

/**
 * ❌ Invalid: Static invalid class before binary expression
 * @invalidClasses [invalid-static]
 * @validClasses [flex, text-red-500]
 */
export function BinaryWithStaticInvalid() {
	return (
		<div className={`flex invalid-static ${isError && 'text-red-500'}`}>
			Static invalid with binary
		</div>
	);
}
