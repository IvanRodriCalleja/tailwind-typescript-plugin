// Simulate dynamic values that might come from props or state
const isDisabled = false;
const isError = false;

/**
 * ✅ Valid: Button-like component with multiple conditionals
 * @validClasses [px-4, py-2, rounded, font-semibold, bg-blue-500, text-white, hover:bg-blue-600, bg-gray-300, text-gray-500, cursor-not-allowed, ring-2, ring-red-500]
 */
export function ButtonWithConditionals() {
	return (
		<button
			className={`px-4 py-2 rounded font-semibold ${isDisabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'} ${isError ? 'ring-2 ring-red-500' : ''}`}>
			Submit
		</button>
	);
}
