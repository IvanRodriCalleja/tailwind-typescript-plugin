import { cva as myCva } from 'class-variance-authority';

/**
 * ❌ Invalid: Import aliasing with invalid class
 * @invalidClasses [invalid-aliased-class]
 * @validClasses [flex, items-center]
 */
export function CvaAliasedInvalid() {
	const component = myCva(['flex', 'invalid-aliased-class', 'items-center']);
	return <div className={component()}>Invalid Aliased</div>;
}
