/**
 * ✅ Valid: Direct variable reference with valid class
 * @validClasses [bg-blue-500]
 */
export function DirectVariableValid() {
	const validSingleClass = 'bg-blue-500';
	return <div className={validSingleClass}>Direct variable reference</div>;
}
