import { clsx as cn } from 'clsx';

/**
 * ✅ Valid: Self-closing with ternary in array
 * @validClasses [rounded-lg, rounded-sm]
 */

const isActive = true;

export function ArrayTernarySelfClosingValid() {
	return <img className={cn([isActive ? 'rounded-lg' : 'rounded-sm'])} src="test.jpg" alt="test" />;
}
