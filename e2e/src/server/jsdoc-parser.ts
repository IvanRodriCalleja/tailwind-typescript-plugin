/**
 * JSDoc annotation parser for example test files.
 * Ported from example/test/test-helpers.ts parseTestFile()
 */

export interface TestCaseExpectations {
	shouldBeValid: boolean;
	comment: string;
	invalidClasses: string[];
	validClasses: string[];
	duplicateClasses: string[];
	extractableClasses: string[];
	conflictClasses: string[];
}

/**
 * Parse JSDoc annotations from an example file to extract expected diagnostics.
 * Works with both JSX (/** ... *​/) and Vue (// comments in <script setup>).
 */
export function parseExpectations(content: string): TestCaseExpectations {
	const result: TestCaseExpectations = {
		shouldBeValid: true,
		comment: '',
		invalidClasses: [],
		validClasses: [],
		duplicateClasses: [],
		extractableClasses: [],
		conflictClasses: []
	};

	const lines = content.split('\n');

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];

		// Check for JSDoc comment start: /**
		const jsdocStart = line.match(/^\/\*\*/);
		if (jsdocStart) {
			// Parse JSDoc block
			for (let j = i + 1; j < Math.min(i + 50, lines.length); j++) {
				const jsdocLine = lines[j];
				if (jsdocLine.match(/\*\//)) break;

				parseAnnotationLine(jsdocLine.replace(/^\s*\*\s?/, ''), result);
			}
			break; // Only parse the first JSDoc block
		}

		// Vue-style comments: // ❌ Invalid: ...
		const vueComment = line.match(/^\s*\/\/\s*(✅|❌|⚠️|💡)\s*(.+)/);
		if (vueComment && !result.comment) {
			result.shouldBeValid =
				vueComment[1] === '✅' || vueComment[1] === '⚠️' || vueComment[1] === '💡';
			result.comment = vueComment[2].trim();

			// Continue parsing subsequent comment lines for annotations
			for (let j = i + 1; j < Math.min(i + 50, lines.length); j++) {
				const nextLine = lines[j].trim();
				if (!nextLine.startsWith('//')) break;
				parseAnnotationLine(nextLine.replace(/^\/\/\s*/, ''), result);
			}
			break;
		}
	}

	return result;
}

function parseAnnotationLine(line: string, result: TestCaseExpectations): void {
	// Status line
	const statusMatch = line.match(/^(✅|❌|⚠️|💡)\s*(.+)/);
	if (statusMatch && !result.comment) {
		result.shouldBeValid =
			statusMatch[1] === '✅' || statusMatch[1] === '⚠️' || statusMatch[1] === '💡';
		result.comment = statusMatch[2].trim();
	}

	// @invalidClasses [class1, class2]
	const invalidMatch = line.match(/@invalidClasses\s*\[([^\]]+)\]/);
	if (invalidMatch) {
		result.invalidClasses = invalidMatch[1].split(',').map(c => c.trim());
	}

	// @validClasses [class1, class2]
	const validMatch = line.match(/@validClasses\s*\[([^\]]+)\]/);
	if (validMatch) {
		result.validClasses = validMatch[1].split(',').map(c => c.trim());
	}

	// @duplicateClasses [class1, class2]
	const duplicateMatch = line.match(/@duplicateClasses\s*\[([^\]]+)\]/);
	if (duplicateMatch) {
		result.duplicateClasses = duplicateMatch[1].split(',').map(c => c.trim());
	}

	// @extractableClasses [class1, class2]
	const extractableMatch = line.match(/@extractableClasses\s*\[([^\]]+)\]/);
	if (extractableMatch) {
		result.extractableClasses = extractableMatch[1].split(',').map(c => c.trim());
	}

	// @conflictClasses [class1, class2]
	const conflictMatch = line.match(/@conflictClasses\s*\[([^\]]+)\]/);
	if (conflictMatch) {
		result.conflictClasses = conflictMatch[1].split(',').map(c => c.trim());
	}
}
