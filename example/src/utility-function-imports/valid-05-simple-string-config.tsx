/**
 * ✅ Valid: Simple string config matches any function with that name (no import check)
 * @utilityFunctions [myUtil]
 * @validClasses [flex, items-center]
 */
export function SimpleStringConfigValid() {
	return (
		<div className={myUtil('flex', 'items-center')}>
			Simple string matches without import verification
		</div>
	);
}

declare function myUtil(...args: string[]): string;
