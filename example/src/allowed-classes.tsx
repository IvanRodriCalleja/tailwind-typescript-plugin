/**
 * E2E Test: Allowed Classes
 * Context: Configuration-based class allowlist
 * Pattern: Custom classes defined in tsconfig allowedClasses
 *
 * Tests validation of: Custom classes that are allowed via configuration
 * Config: allowedClasses: ["custom-button", "app-header", "project-card"]
 */

// ========================================
// SINGLE ALLOWED CLASS TESTS
// ========================================

/**
 * ✅ Valid: Single allowed custom class
 * @validClasses [custom-button]
 */
export function SingleAllowedClass() {
	return <div className="custom-button">Custom button class</div>;
}

/**
 * ✅ Valid: Another allowed custom class
 * @validClasses [app-header]
 */
export function AnotherAllowedClass() {
	return <div className="app-header">App header class</div>;
}

/**
 * ❌ Invalid: Custom class NOT in allowed list
 * @invalidClasses [not-allowed-class]
 */
export function NotAllowedClass() {
	return <div className="not-allowed-class">Not allowed custom class</div>;
}

// ========================================
// ALLOWED CLASSES WITH TAILWIND CLASSES
// ========================================

/**
 * ✅ Valid: Allowed custom class with Tailwind classes
 * @validClasses [custom-button, flex, items-center, justify-center]
 */
export function AllowedWithTailwind() {
	return <div className="custom-button flex items-center justify-center">Custom + Tailwind</div>;
}

/**
 * ✅ Valid: Multiple allowed classes with Tailwind
 * @validClasses [custom-button, app-header, bg-blue-500, text-white, p-4]
 */
export function MultipleAllowedWithTailwind() {
	return (
		<div className="custom-button app-header bg-blue-500 text-white p-4">
			Multiple custom + Tailwind
		</div>
	);
}

/**
 * ❌ Invalid: Mix of allowed, Tailwind, and invalid classes
 * @invalidClasses [invalid-class]
 * @validClasses [custom-button, flex, items-center]
 */
export function MixedAllowedTailwindInvalid() {
	return (
		<div className="custom-button flex invalid-class items-center">Custom + Tailwind + Invalid</div>
	);
}

// ========================================
// ALLOWED CLASSES IN DIFFERENT POSITIONS
// ========================================

/**
 * ✅ Valid: Allowed class at the beginning
 * @validClasses [project-card, container, mx-auto]
 */
export function AllowedClassFirst() {
	return <div className="project-card container mx-auto">Allowed class first</div>;
}

/**
 * ✅ Valid: Allowed class in the middle
 * @validClasses [flex, custom-button, items-center]
 */
export function AllowedClassMiddle() {
	return <div className="flex custom-button items-center">Allowed class middle</div>;
}

/**
 * ✅ Valid: Allowed class at the end
 * @validClasses [flex, items-center, app-header]
 */
export function AllowedClassLast() {
	return <div className="flex items-center app-header">Allowed class last</div>;
}

// ========================================
// ALLOWED CLASSES WITH UTILITY FUNCTIONS
// ========================================

/**
 * ✅ Valid: Allowed classes with clsx
 * @validClasses [custom-button, app-header, flex]
 */
export function AllowedWithClsx() {
	return <div className={clsx('custom-button', 'app-header', 'flex')}>Allowed with clsx</div>;
}

/**
 * ❌ Invalid: Mix of allowed and invalid in clsx
 * @invalidClasses [invalid-class]
 * @validClasses [custom-button, flex]
 */
export function AllowedWithClsxInvalid() {
	return (
		<div className={clsx('custom-button', 'invalid-class', 'flex')}>
			Allowed + invalid with clsx
		</div>
	);
}

// ========================================
// ALLOWED CLASSES WITH TEMPLATE LITERALS
// ========================================

/**
 * ✅ Valid: Allowed classes in template literal
 * @validClasses [custom-button, flex, items-center]
 */
export function AllowedInTemplate() {
	return <div className={`custom-button flex items-center`}>Allowed in template</div>;
}

/**
 * ✅ Valid: Allowed classes with dynamic parts
 * @validClasses [custom-button, flex]
 */
export function AllowedInTemplateDynamic() {
	const isActive = true;
	return (
		<div className={`custom-button flex ${isActive ? 'bg-blue-500' : ''}`}>Allowed dynamic</div>
	);
}

/**
 * ❌ Invalid: Invalid class in template with allowed classes
 * @invalidClasses [invalid-class]
 * @validClasses [custom-button, flex]
 */
export function AllowedInTemplateWithInvalid() {
	return <div className={`custom-button flex invalid-class`}>Allowed + invalid in template</div>;
}

// ========================================
// ALLOWED CLASSES WITH ARRAYS
// ========================================

/**
 * ✅ Valid: Allowed classes in array
 * @validClasses [custom-button, app-header, flex]
 */
export function AllowedInArray() {
	return <div className={clsx(['custom-button', 'app-header', 'flex'])}>Allowed in array</div>;
}

/**
 * ❌ Invalid: Mix of allowed and invalid in array
 * @invalidClasses [invalid-class]
 * @validClasses [custom-button, flex]
 */
export function AllowedInArrayWithInvalid() {
	return (
		<div className={clsx(['custom-button', 'invalid-class', 'flex'])}>
			Allowed + invalid in array
		</div>
	);
}

// ========================================
// ALLOWED CLASSES WITH OBJECTS
// ========================================

/**
 * ✅ Valid: Allowed classes as object keys
 * @validClasses [custom-button, app-header]
 */
export function AllowedInObject() {
	return (
		<div className={clsx({ 'custom-button': true, 'app-header': true })}>Allowed in object</div>
	);
}

/**
 * ❌ Invalid: Invalid class as object key with allowed classes
 * @invalidClasses [invalid-class]
 * @validClasses [custom-button]
 */
export function AllowedInObjectWithInvalid() {
	return (
		<div className={clsx({ 'custom-button': true, 'invalid-class': true })}>
			Allowed + invalid in object
		</div>
	);
}

// ========================================
// ALL CONFIGURED ALLOWED CLASSES
// ========================================

/**
 * ✅ Valid: All configured allowed classes together
 * @validClasses [custom-button, app-header, project-card]
 */
export function AllConfiguredClasses() {
	return (
		<div className="custom-button app-header project-card">All configured allowed classes</div>
	);
}

/**
 * ✅ Valid: All allowed classes with Tailwind classes
 * @validClasses [custom-button, app-header, project-card, flex, items-center, justify-between, bg-gray-100, p-4]
 */
export function AllConfiguredWithTailwind() {
	return (
		<div className="custom-button app-header project-card flex items-center justify-between bg-gray-100 p-4">
			All allowed + Tailwind classes
		</div>
	);
}

declare function clsx(...args: any[]): string;
