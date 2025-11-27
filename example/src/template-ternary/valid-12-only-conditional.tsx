// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ✅ Valid: Only conditional expression, no static classes
 * @validClasses [bg-blue-500, bg-gray-500]
 */
export function OnlyConditional() {
	return <div className={`${isActive ? 'bg-blue-500' : 'bg-gray-500'}`}>Only conditional</div>;
}
