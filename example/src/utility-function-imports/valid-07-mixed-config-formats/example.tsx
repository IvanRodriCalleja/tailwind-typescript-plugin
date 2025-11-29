/**
 * ✅ Valid: Mixed configuration with both string and object formats
 * @utilityFunctions [simpleFn, {"name": "preciseFn", "from": "@/utils"}]
 * @validClasses [flex, gap-4, items-center, bg-white]
 */
import { preciseFn } from '@/utils';

export function MixedConfigFormatsValid() {
	return (
		<>
			<div className={simpleFn('flex', 'gap-4')}>Simple string config</div>
			<div className={preciseFn('items-center', 'bg-white')}>
				Object config with import verification
			</div>
		</>
	);
}

declare function simpleFn(...args: string[]): string;
