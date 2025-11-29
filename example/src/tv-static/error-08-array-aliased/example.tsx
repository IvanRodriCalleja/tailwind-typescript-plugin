import { tv as myTv } from 'tailwind-variants';

/**
 * ❌ Invalid: Array with aliasing and invalid class
 * @invalidClasses [invalid-combo-class]
 * @validClasses [flex, items-center]
 */
export function TvArrayAliasedInvalid() {
	const component = myTv({
		base: ['flex', 'items-center', 'invalid-combo-class']
	});
	return <div className={component()}>Invalid Array + Aliased</div>;
}
