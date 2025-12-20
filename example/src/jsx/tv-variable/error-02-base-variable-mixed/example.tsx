import { tv } from 'tailwind-variants';

/**
 * ❌ Invalid: Variable with mixed valid/invalid classes in base
 * @invalidClasses [invalid-tv-mixed-var]
 * @validClasses [flex, items-center]
 */
export function TvBaseVariableMixed() {
	const mixedClasses = 'flex invalid-tv-mixed-var items-center';
	const button = tv({
		base: mixedClasses
	});
	return <button className={button()}>Mixed Base Variable</button>;
}
