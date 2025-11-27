import { cva } from 'class-variance-authority';

/**
 * ✅ Valid: Same class in different cva() calls
 * Each cva() has its own scope
 * @validClasses [flex, items-center, flex, justify-center]
 */
export function CvaNoDuplicateDifferentCalls() {
	const button = cva(['flex', 'items-center']);
	const card = cva(['flex', 'justify-center']);
	return (
		<>
			<button className={button()}>Button</button>
			<div className={card()}>Card</div>
		</>
	);
}
