/**
 * ❌ Invalid: All classes are invalid
 * @invalidClasses [badclass, anotherBad, wrongClass]
 */
export function MultipleClassesAllInvalid() {
	return <div className={'badclass anotherBad wrongClass'}>All invalid classes</div>;
}
