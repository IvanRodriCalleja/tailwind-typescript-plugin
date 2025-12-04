/**
 * ✅ Valid: Default className still works when custom attributes are configured
 * Tests that adding classAttributes doesn't break default className support
 * @validClasses [flex, items-center]
 */
export function DefaultClassNameStillWorks() {
	return <div className="flex items-center">Default className with custom config</div>;
}
