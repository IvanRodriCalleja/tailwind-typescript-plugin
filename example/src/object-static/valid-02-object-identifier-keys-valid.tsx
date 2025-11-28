import clsx from 'clsx';

/**
 * ✅ Valid: Object with identifier keys, all valid
 * @validClasses [flex, items-center]
 */
export function ObjectIdentifierKeysValid() {
	return <div className={clsx({ flex: true, 'items-center': true })}>Identifier keys</div>;
}

