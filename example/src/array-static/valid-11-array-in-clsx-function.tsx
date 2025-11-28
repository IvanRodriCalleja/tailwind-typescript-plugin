import clsx from 'clsx';

/**
 * ✅ Valid: Array in clsx() function
 * @validClasses [flex, items-center, justify-center]
 */
export function ArrayInClsxFunction() {
	return <div className={clsx(['flex', 'items-center', 'justify-center'])}>Array in clsx()</div>;
}

