/**
 * ✅ Valid: Variable with arbitrary values
 * @validClasses [h-[50vh], w-[100px], bg-[#ff0000]]
 */
export function ArbitraryValuesValid() {
	const arbitraryValid = 'h-[50vh] w-[100px] bg-[#ff0000]';
	return <div className={arbitraryValid}>Arbitrary values in variable - valid</div>;
}
