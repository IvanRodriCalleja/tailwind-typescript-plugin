#!/usr/bin/env node
/**
 * Script to convert JSX tests to Vue tests
 *
 * This converts:
 * - example.tsx → example.vue
 * - example.spec.tsx → example.spec.tsx (with updated imports)
 * - tsconfig.json → tsconfig.json (with jsx: preserve)
 * - global.css → global.css (copied as-is)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JSX_DIR = path.join(__dirname, '../src/jsx');
const VUE_DIR = path.join(__dirname, '../src/vue');

/**
 * Parse JSX file and extract components
 */
function parseJsxFile(content) {
	const result = {
		imports: [],
		variables: [],
		classExpression: '',
		innerText: '',
		comment: '',
		tagName: 'div',
		isSelfClosing: false
	};

	// Extract imports
	const importMatches = content.matchAll(/^import .+;$/gm);
	for (const match of importMatches) {
		result.imports.push(match[0]);
	}

	// Extract top-level comment
	const commentMatch = content.match(/\/\*\*[\s\S]*?\*\//);
	if (commentMatch) {
		result.comment = commentMatch[0];
	}

	// Extract ALL const/let declarations (both top-level and inside functions)
	// Match multiline variable declarations (including ones with template literals, objects, etc.)
	const lines = content.split('\n');
	let inVariableDecl = false;
	let currentVar = '';
	let braceCount = 0;
	let parenCount = 0;
	let bracketCount = 0;

	for (const line of lines) {
		const trimmedLine = line.trim();

		// Skip imports, function declarations, returns, exports
		if (trimmedLine.startsWith('import ') ||
			trimmedLine.startsWith('export function') ||
			trimmedLine.startsWith('export default') ||
			trimmedLine.startsWith('return ') ||
			trimmedLine.startsWith('return(') ||
			trimmedLine.startsWith('function ') ||
			trimmedLine === 'return (' ||
			trimmedLine === '}' ||
			trimmedLine === '{' ||
			trimmedLine === '' ||
			trimmedLine.startsWith('/**') ||
			trimmedLine.startsWith('*') ||
			trimmedLine.startsWith('*/') ||
			trimmedLine.startsWith('//')) {
			continue;
		}

		// Start of a const/let declaration
		if ((trimmedLine.startsWith('const ') || trimmedLine.startsWith('let ')) && !inVariableDecl) {
			inVariableDecl = true;
			currentVar = line;
			braceCount = (line.match(/{/g) || []).length - (line.match(/}/g) || []).length;
			parenCount = (line.match(/\(/g) || []).length - (line.match(/\)/g) || []).length;
			bracketCount = (line.match(/\[/g) || []).length - (line.match(/\]/g) || []).length;

			// Check if it's complete on one line
			if (braceCount === 0 && parenCount === 0 && bracketCount === 0 && trimmedLine.endsWith(';')) {
				result.variables.push(trimmedLine);
				inVariableDecl = false;
				currentVar = '';
			}
		} else if (inVariableDecl) {
			// Continue building multiline variable
			currentVar += '\n' + line;
			braceCount += (line.match(/{/g) || []).length - (line.match(/}/g) || []).length;
			parenCount += (line.match(/\(/g) || []).length - (line.match(/\)/g) || []).length;
			bracketCount += (line.match(/\[/g) || []).length - (line.match(/\]/g) || []).length;

			// Check if complete
			if (braceCount === 0 && parenCount === 0 && bracketCount === 0 && trimmedLine.endsWith(';')) {
				result.variables.push(currentVar.trim());
				inVariableDecl = false;
				currentVar = '';
			}
		}
	}

	// Find the return statement and extract JSX
	// First try multiline return with parentheses - use greedy match and look for matching parens
	const returnWithParenMatch = content.match(/return\s*\(/);
	if (returnWithParenMatch) {
		const startIdx = returnWithParenMatch.index + returnWithParenMatch[0].length;
		let depth = 1;
		let endIdx = startIdx;
		for (let i = startIdx; i < content.length; i++) {
			if (content[i] === '(') depth++;
			else if (content[i] === ')') {
				depth--;
				if (depth === 0) {
					endIdx = i;
					break;
				}
			}
		}
		if (depth === 0) {
			result.fullJsx = content.substring(startIdx, endIdx).trim();
		}
	} else {
		// Try single line return
		const singleReturnMatch = content.match(/return\s+(<[\s\S]*?>[\s\S]*?<\/\w+>|<[\s\S]*?\/>)/);
		if (singleReturnMatch) {
			result.fullJsx = singleReturnMatch[1].trim();
		}
	}

	// Find the first JSX element for simple cases
	const jsxMatch = content.match(/<(\w+)\s+className=([\s\S]*?)(?:\/?>|>([\s\S]*?)<\/\1>)/);
	if (jsxMatch) {
		result.tagName = jsxMatch[1];

		// Parse className value
		let classNameValue = jsxMatch[2].trim();

		// Handle self-closing tags
		if (jsxMatch[0].endsWith('/>')) {
			result.isSelfClosing = true;
			// Remove trailing /> from className if present
			classNameValue = classNameValue.replace(/\s*\/>$/, '').replace(/\s*>$/, '');
		} else {
			// Remove trailing > from className if present
			classNameValue = classNameValue.replace(/\s*>$/, '');
		}

		result.classExpression = classNameValue;
		result.innerText = jsxMatch[3] || '';
	}

	return result;
}

/**
 * Convert className expression to Vue class binding
 */
function convertClassExpression(expr) {
	expr = expr.trim();

	// Remove trailing > if present (from regex capture)
	expr = expr.replace(/>$/, '').trim();

	// Static string: className="flex items-center"
	if (expr.startsWith('"') && expr.endsWith('"')) {
		return { type: 'static', value: expr.slice(1, -1) };
	}

	// Expression: className={'flex'} or className={...}
	if (expr.startsWith('{') && expr.endsWith('}')) {
		let inner = expr.slice(1, -1).trim();

		// Check if it's a simple string literal: {'flex'} or {"flex"}
		// This can be converted to a static class
		if ((inner.startsWith("'") && inner.endsWith("'")) ||
			(inner.startsWith('"') && inner.endsWith('"'))) {
			// Check if there are no special characters that would indicate a complex expression
			const unquoted = inner.slice(1, -1);
			if (!unquoted.includes('${') && !unquoted.includes("'") && !unquoted.includes('"')) {
				return { type: 'static', value: unquoted };
			}
		}

		// Template literal: {`flex ${variable}`}
		if (inner.startsWith('`') && inner.endsWith('`')) {
			return { type: 'dynamic', value: inner };
		}

		return { type: 'dynamic', value: inner };
	}

	return { type: 'static', value: expr };
}

/**
 * Find matching closing brace, handling nested braces
 */
function findMatchingBrace(str, start) {
	let depth = 0;
	for (let i = start; i < str.length; i++) {
		if (str[i] === '{') depth++;
		else if (str[i] === '}') {
			depth--;
			if (depth === 0) return i;
		}
	}
	return -1;
}

/**
 * Convert JSX to Vue template
 */
function convertJsxToVueTemplate(jsx) {
	if (!jsx) return '';

	let result = jsx;

	// Handle className={...} expressions with nested braces
	let pos = 0;
	while (true) {
		const match = result.indexOf('className={', pos);
		if (match === -1) break;

		const braceStart = match + 'className='.length;
		const braceEnd = findMatchingBrace(result, braceStart);
		if (braceEnd === -1) {
			pos = match + 1;
			continue;
		}

		const expr = result.substring(braceStart + 1, braceEnd).trim();

		let replacement;
		// Simple string literal: 'flex' or "flex"
		if ((expr.startsWith("'") && expr.endsWith("'")) ||
			(expr.startsWith('"') && expr.endsWith('"'))) {
			const unquoted = expr.slice(1, -1);
			if (!unquoted.includes('${') && !unquoted.includes("'") && !unquoted.includes('"')) {
				replacement = `class="${unquoted}"`;
			} else {
				replacement = `:class="${expr}"`;
			}
		} else {
			// Template literal or complex expression
			replacement = `:class="${expr}"`;
		}

		result = result.substring(0, match) + replacement + result.substring(braceEnd + 1);
		pos = match + replacement.length;
	}

	// Handle className="..." static strings
	result = result.replace(/className="([^"]+)"/g, 'class="$1"');

	return result;
}

/**
 * Generate Vue file content
 */
function generateVueFile(parsed) {
	const lines = [];

	// Script setup
	lines.push('<script setup lang="ts">');

	// Add imports (excluding React-specific ones)
	const vueImports = parsed.imports.filter(imp =>
		!imp.includes('react') &&
		!imp.includes('React')
	);

	if (vueImports.length > 0) {
		lines.push(...vueImports);
	}

	// Add variables
	if (parsed.variables.length > 0) {
		if (vueImports.length > 0) lines.push('');
		lines.push(...parsed.variables);
	}

	// Add comment as regular comments
	if (parsed.comment) {
		const commentLines = parsed.comment
			.replace(/\/\*\*/, '')
			.replace(/\*\//, '')
			.split('\n')
			.map(l => l.replace(/^\s*\*\s?/, '').trim())
			.filter(l => l);

		if (commentLines.length > 0 && (vueImports.length > 0 || parsed.variables.length > 0)) {
			lines.push('');
		}
		commentLines.forEach(l => {
			if (l) lines.push(`// ${l}`);
		});
	}

	lines.push('</script>');
	lines.push('');
	lines.push('<template>');

	// Use fullJsx if available, otherwise fall back to simple element
	if (parsed.fullJsx) {
		const vueTemplate = convertJsxToVueTemplate(parsed.fullJsx);
		// Indent the template
		const templateLines = vueTemplate.split('\n').map(l => '  ' + l);
		lines.push(...templateLines);
	} else {
		// Generate template element (fallback for simple cases)
		const classBinding = convertClassExpression(parsed.classExpression);
		let classAttr;

		if (classBinding.type === 'static') {
			classAttr = `class="${classBinding.value}"`;
		} else {
			classAttr = `:class="${classBinding.value}"`;
		}

		if (parsed.isSelfClosing) {
			lines.push(`  <${parsed.tagName} ${classAttr} />`);
		} else {
			lines.push(`  <${parsed.tagName} ${classAttr}>${parsed.innerText}</${parsed.tagName}>`);
		}
	}

	lines.push('</template>');
	lines.push('');

	return lines.join('\n');
}

/**
 * Convert spec file imports
 */
function convertSpecFile(content, category) {
	// Replace import path
	let newContent = content.replace(
		/from ['"]\.\.\/\.\.\/\.\.\/\.\.\/test\/folder-test-helpers['"]/g,
		"from '../../../../test/vue-test-helpers'"
	);

	// Replace runPlugin with runVuePlugin
	newContent = newContent.replace(/runPlugin/g, 'runVuePlugin');

	// Replace sourceCode with generatedCode (for Vue diagnostics)
	newContent = newContent.replace(/sourceCode/g, 'generatedCode');

	return newContent;
}

/**
 * Convert tsconfig.json
 */
function convertTsconfig(content) {
	const config = JSON.parse(content);

	// Change jsx to preserve for Vue
	if (config.compilerOptions) {
		config.compilerOptions.jsx = 'preserve';
	}

	// Update include to have both tsx and vue
	config.include = ['*.tsx', '*.vue'];

	return JSON.stringify(config, null, 2) + '\n';
}

/**
 * Process a single test folder
 */
function processTestFolder(srcFolder, destFolder) {
	// Read files
	const exampleTsx = path.join(srcFolder, 'example.tsx');
	const specTsx = path.join(srcFolder, 'example.spec.tsx');
	const tsconfig = path.join(srcFolder, 'tsconfig.json');
	const globalCss = path.join(srcFolder, 'global.css');

	if (!fs.existsSync(exampleTsx)) {
		console.log(`  Skipping: No example.tsx found`);
		return false;
	}

	// Create destination folder
	fs.mkdirSync(destFolder, { recursive: true });

	// Convert example.tsx to example.vue
	try {
		const tsxContent = fs.readFileSync(exampleTsx, 'utf-8');
		const parsed = parseJsxFile(tsxContent);
		const vueContent = generateVueFile(parsed);
		fs.writeFileSync(path.join(destFolder, 'example.vue'), vueContent);
	} catch (err) {
		console.log(`  Error converting example.tsx: ${err.message}`);
		return false;
	}

	// Convert spec file
	if (fs.existsSync(specTsx)) {
		try {
			const specContent = fs.readFileSync(specTsx, 'utf-8');
			const category = path.basename(path.dirname(srcFolder));
			const newSpecContent = convertSpecFile(specContent, category);
			fs.writeFileSync(path.join(destFolder, 'example.spec.tsx'), newSpecContent);
		} catch (err) {
			console.log(`  Error converting spec file: ${err.message}`);
		}
	}

	// Convert tsconfig
	if (fs.existsSync(tsconfig)) {
		try {
			const tsconfigContent = fs.readFileSync(tsconfig, 'utf-8');
			const newTsconfigContent = convertTsconfig(tsconfigContent);
			fs.writeFileSync(path.join(destFolder, 'tsconfig.json'), newTsconfigContent);
		} catch (err) {
			console.log(`  Error converting tsconfig: ${err.message}`);
		}
	}

	// Copy global.css
	if (fs.existsSync(globalCss)) {
		fs.copyFileSync(globalCss, path.join(destFolder, 'global.css'));
	}

	return true;
}

/**
 * Main function
 */
function main() {
	console.log('Converting JSX tests to Vue tests...\n');

	// Get all categories
	const categories = fs.readdirSync(JSX_DIR).filter(f =>
		fs.statSync(path.join(JSX_DIR, f)).isDirectory()
	);

	let totalConverted = 0;
	let totalFailed = 0;

	for (const category of categories) {
		const categoryPath = path.join(JSX_DIR, category);
		const tests = fs.readdirSync(categoryPath).filter(f =>
			fs.statSync(path.join(categoryPath, f)).isDirectory()
		);

		console.log(`\nCategory: ${category} (${tests.length} tests)`);

		for (const test of tests) {
			const srcFolder = path.join(categoryPath, test);
			const destFolder = path.join(VUE_DIR, category, test);

			process.stdout.write(`  Converting ${test}... `);

			if (processTestFolder(srcFolder, destFolder)) {
				console.log('OK');
				totalConverted++;
			} else {
				totalFailed++;
			}
		}
	}

	console.log(`\n\nConversion complete!`);
	console.log(`  Converted: ${totalConverted}`);
	console.log(`  Failed: ${totalFailed}`);
}

main();
