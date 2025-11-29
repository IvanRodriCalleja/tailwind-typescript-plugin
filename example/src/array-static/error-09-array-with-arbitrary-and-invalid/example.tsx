import { clsx as cn } from 'clsx';

/**
 * ❌ Invalid: Array with mix of arbitrary and invalid
 * @invalidClasses [invalid-size]
 * @validClasses [h-[50vh], w-[100px]]
 */
export function ArrayWithArbitraryAndInvalid() {
	return (
		<div className={cn(['h-[50vh]', 'invalid-size', 'w-[100px]'])}>
			Array with arbitrary and invalid
		</div>
	);
}
