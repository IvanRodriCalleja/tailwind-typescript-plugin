// Simulate dynamic class names that might come from props or state
const dynamicClass = 'some-dynamic-class';
const anotherClass = 'another-class';

/**
 * ❌ Invalid: Multiple elements with template literals
 * @element {1} First child with invalid class in template
 * @invalidClasses {1} [bad-class]
 * @validClasses {1} [flex]
 * @element {2} Second child with all valid classes
 * @validClasses {2} [container, mx-auto]
 * @element {3} Third child with invalid class after interpolation
 * @invalidClasses {3} [another-bad]
 * @validClasses {3} [grid]
 */
export function MultipleElementsWithTemplates() {
	return (
		<div className="flex flex-col">
			<div className={`flex ${dynamicClass} bad-class`}>Invalid in first child</div>
			<div className={`container ${anotherClass} mx-auto`}>Valid in second child</div>
			<div className={`grid ${dynamicClass} another-bad`}>Invalid in third child</div>
		</div>
	);
}
