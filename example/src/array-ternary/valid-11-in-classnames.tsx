import classNames from 'classnames';

/**
 * ✅ Valid: Ternary in array with classNames()
 * @validClasses [flex, bg-blue-500, bg-gray-500]
 */

const isActive = true;

export function ArrayTernaryInClassNames() {
	return (
		<div className={classNames(['flex', isActive ? 'bg-blue-500' : 'bg-gray-500'])}>
			Ternary in classNames
		</div>
	);
}

