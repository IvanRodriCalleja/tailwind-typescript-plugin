/**
 * ❌ Invalid: Mix of valid and invalid classes
 * @invalidClasses [invalidclass, badone]
 * @validClasses [flex, items-center]
 */
export function MultipleClassesMixed() {
	return <div className="flex invalidclass items-center badone">Mixed valid and invalid</div>;
}
