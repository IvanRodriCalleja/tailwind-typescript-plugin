import clsx from 'clsx';

/**
 * ❌ Invalid: Invalid class in last argument
 * @invalidClasses [invalid-last]
 * @validClasses [flex, items-center]
 */
export function InvalidInLastArgument() {
	return <div className={clsx('flex', 'items-center', 'invalid-last')}>Invalid in last</div>;
}
