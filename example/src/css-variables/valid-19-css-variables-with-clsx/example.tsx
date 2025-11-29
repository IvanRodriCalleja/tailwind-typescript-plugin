import clsx from 'clsx';

/**
 * ✅ Valid: CSS variables with clsx
 * @validClasses [[--card-bg:#1e293b], bg-[var(--card-bg)], p-4]
 */
export function CSSVariablesWithClsx() {
	return (
		<div className={clsx('[--card-bg:#1e293b]', 'bg-[var(--card-bg)]', 'p-4')}>
			CSS variables with clsx
		</div>
	);
}
