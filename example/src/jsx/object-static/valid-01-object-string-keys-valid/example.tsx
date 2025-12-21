import clsx from 'clsx';

/**
 * ✅ Valid: Object with string literal keys, all valid
 * @validClasses [flex, items-center]
 */
export function ObjectStringKeysValid() {
	return <div className={clsx({ flex: true, 'items-center': true })}>Object with string keys</div>;
}
