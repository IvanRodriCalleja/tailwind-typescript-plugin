import classNames from 'classnames';

/**
 * ✅ Valid: Array in classNames() function
 * @validClasses [flex, items-center, justify-center]
 */
export function ArrayInClassNamesFunction() {
	return (
		<div className={classNames(['flex', 'items-center', 'justify-center'])}>
			Array in classNames()
		</div>
	);
}
