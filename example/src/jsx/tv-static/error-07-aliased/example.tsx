import { tv as myTv } from 'tailwind-variants';

/**
 * ❌ Invalid: Import aliasing with invalid class
 * @invalidClasses [invalid-aliased-class]
 * @validClasses [flex, items-center]
 */
export function TvAliasedInvalid() {
	const component = myTv({
		base: 'flex invalid-aliased-class items-center'
	});
	return <div className={component()}>Invalid Aliased</div>;
}
