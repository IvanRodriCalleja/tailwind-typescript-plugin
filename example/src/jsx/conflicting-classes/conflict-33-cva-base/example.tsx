import { cva } from 'class-variance-authority';

/**
 * ⚠️ Warning: Conflict in cva() base array
 * @conflictClasses [flex, grid]
 */
export function CvaBaseConflict() {
	const button = cva(['flex', 'grid', 'items-center']);
	return <button className={button()}>CVA base conflict</button>;
}
