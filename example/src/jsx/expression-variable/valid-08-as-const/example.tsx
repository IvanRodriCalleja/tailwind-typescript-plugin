/**
 * ✅ Valid: Variable with as const assertion
 * @validClasses [bg-blue-500]
 */
export function AsConstValid() {
	const asConstValid = 'bg-blue-500' as const;
	return <div className={asConstValid}>As const assertion - valid</div>;
}
