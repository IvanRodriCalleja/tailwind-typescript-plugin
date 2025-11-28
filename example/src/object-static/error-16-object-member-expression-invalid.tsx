import * as utils from 'clsx';

// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ❌ Invalid: Member expression with invalid in object
 * @invalidClasses [invalid-class]
 * @validClasses [flex, items-center]
 */
export function ObjectMemberExpressionInvalid() {
	return (
		<div className={utils.clsx({ flex: true, 'invalid-class': true, 'items-center': isActive })}>
			Member invalid
		</div>
	);
}
