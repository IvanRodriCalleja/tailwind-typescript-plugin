/**
 * Valid: Default className still works when custom attributes are configured
 * @validClasses [flex, items-center, justify-center]
 */
export function DefaultClassNameStillWorks() {
	return <div className="flex items-center justify-center">Hello</div>;
}
