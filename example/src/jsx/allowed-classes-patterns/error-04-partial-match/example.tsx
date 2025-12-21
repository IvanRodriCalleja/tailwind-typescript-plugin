/**
 * ❌ Invalid: exact-match-extra doesn't match exact-match (exact matches are exact)
 * @invalidClasses [exact-match-extra]
 */
export function PartialMatch() {
	return <div className="exact-match-extra">Partial match</div>;
}
