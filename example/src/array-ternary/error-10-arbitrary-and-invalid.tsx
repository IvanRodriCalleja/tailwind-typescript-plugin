import { clsx as cn } from 'clsx';

/**
 * ❌ Invalid: Ternary with mix of arbitrary and invalid in array
 * @invalidClasses [invalid-size]
 * @validClasses [flex, h-[50vh], h-[30vh]]
 */

const isActive = true;

export function ArrayTernaryWithArbitraryAndInvalid() {
	return (
		<div className={cn(['flex', isActive ? 'h-[50vh] invalid-size' : 'h-[30vh]'])}>
			Ternary with arbitrary and invalid
		</div>
	);
}

