import clsx from 'clsx';

// Simulate dynamic values that might come from props or state
const isDisabled = false;
const hasError = false;

/**
 * ❌ Invalid: Object with invalid key and variable value
 * @invalidClasses [invalid-error]
 * @validClasses [flex, bg-gray-100]
 */
export function ObjectVariableValuesInvalid() {
	return (
		<div className={clsx({ flex: true, 'invalid-error': hasError, 'bg-gray-100': isDisabled })}>
			Invalid with variables
		</div>
	);
}

