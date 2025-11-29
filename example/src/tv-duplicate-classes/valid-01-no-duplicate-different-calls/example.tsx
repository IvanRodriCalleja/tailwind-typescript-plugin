import { tv } from 'tailwind-variants';

/**
 * ✅ Valid: Same class in different tv() calls
 */
export function TvNoDuplicateDifferentCalls() {
	const button = tv({
		base: 'flex items-center'
	});
	const card = tv({
		base: 'flex justify-center'
	});
	return (
		<>
			<button className={button()}>Button</button>
			<div className={card()}>Card</div>
		</>
	);
}
