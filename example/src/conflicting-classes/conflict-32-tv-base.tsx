import { tv } from 'tailwind-variants';

/**
 * ⚠️ Warning: Conflict in tv() base
 * @conflictClasses [flex, block]
 */
export function TvBaseConflict() {
	const button = tv({
		base: 'flex block items-center'
	});
	return <button className={button()}>TV base conflict</button>;
}
