import { clsx as cn } from 'clsx';

// @test-scope-start
const baseClasses = 'flex items-center';
const duplicateVar = 'flex';

/**
 * ⚠️ Warning: Duplicate via variable - variable contains duplicate of base
 * @duplicateClasses [flex, flex]
 */
export function DuplicateViaVariable() {
	return <div className={cn(baseClasses, duplicateVar)}>Duplicate via variable</div>;
}

