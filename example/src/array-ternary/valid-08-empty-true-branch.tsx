import { clsx as cn } from 'clsx';

/**
 * ✅ Valid: Ternary with empty string in true branch
 * @validClasses [flex, bg-gray-500]
 */

const isActive = true;

export function ArrayTernaryWithEmptyTrue() {
	return <div className={cn(['flex', isActive ? '' : 'bg-gray-500'])}>Empty true branch</div>;
}

