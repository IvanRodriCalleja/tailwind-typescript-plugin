/**
 * ✅ Valid: Self-closing element with variable reference
 * @validClasses [w-full, h-auto]
 */
export function SelfClosingWithVariable() {
	const imgClasses = 'w-full h-auto';
	return <img className={imgClasses} src="test.jpg" alt="test" />;
}
