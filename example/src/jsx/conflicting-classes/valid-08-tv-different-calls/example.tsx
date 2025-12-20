import { tv } from 'tailwind-variants';

/**
 * ✅ Valid: No conflict between different tv() calls
 */
export function TvDifferentCallsNoConflict() {
	const tvButton = tv({
		base: 'text-left'
	});
	const tvCard = tv({
		base: 'text-center'
	});
	return (
		<>
			<button className={tvButton()}>Button</button>
			<div className={tvCard()}>Card</div>
		</>
	);
}
