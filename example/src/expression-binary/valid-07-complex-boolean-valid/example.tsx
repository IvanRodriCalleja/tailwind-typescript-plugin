// Simulate dynamic values that might come from props or state
const isError = true;
const hasWarning = false;

/**
 * ✅ Valid: Complex boolean with all valid
 * @validClasses [bg-red-500]
 */
export function ComplexBooleanValid() {
	return <div className={(isError || hasWarning) && 'bg-red-500'}>Complex boolean logic</div>;
}
