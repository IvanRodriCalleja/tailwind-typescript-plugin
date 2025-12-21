import classNames from 'classnames';

// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ✅ Valid: Object in classNames() function
 * @validClasses [flex, items-center, justify-center]
 */
export function ObjectInClassNamesFunction() {
	return (
		<div className={classNames({ flex: true, 'items-center': true, 'justify-center': isActive })}>
			Object in classNames()
		</div>
	);
}
