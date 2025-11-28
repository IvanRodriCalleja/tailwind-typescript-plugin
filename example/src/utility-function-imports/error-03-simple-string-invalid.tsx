/**
 * ❌ Invalid: Simple string config with invalid class
 * @utilityFunctions [customFn]
 * @invalidClasses [bad-class]
 * @validClasses [flex]
 */
export function SimpleStringConfigInvalid() {
	return (
		<div className={customFn('flex', 'bad-class')}>Simple string config with invalid class</div>
	);
}

declare function customFn(...args: string[]): string;
