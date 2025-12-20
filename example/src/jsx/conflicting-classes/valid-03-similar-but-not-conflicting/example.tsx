/**
 * ✅ Valid: Similar but non-conflicting classes
 * p-4 and pt-8 affect different properties (padding vs padding-top)
 * @validClasses [p-4, pt-8]
 */
export function SimilarButNotConflicting() {
	return <div className="p-4 pt-8">Similar but not conflicting</div>;
}
