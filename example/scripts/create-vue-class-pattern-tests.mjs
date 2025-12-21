#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const baseDir = '/Users/ivanrodriguezcalleja/git/other-plugin/example/src/vue/allowed-classes';

const tsconfig = `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "preserve",
    "strict": true,
    "plugins": [
      {
        "name": "tailwind-typescript-plugin",
        "globalCss": "./global.css",
        "validation": {
          "allowedClasses": ["custom-button", "app-header", "project-card"]
        }
      }
    ]
  },
  "include": ["*.tsx", "*.vue"]
}
`;

const globalCss = `@import "tailwindcss";
`;

const tests = [
  // Pattern 2 Error
  {
    name: 'error-14-dynamic-string-invalid',
    vue: `<script setup lang="ts">
// Pattern 2 Error: Dynamic string with invalid class
// @invalidClasses [invalid-dynamic]
// @validClasses [custom-button, flex]
const myClass = 'custom-button flex invalid-dynamic';
</script>

<template>
  <div :class="myClass">
    Dynamic string with invalid
  </div>
</template>
`,
    spec: `import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] allowed-classes', () => {
	describe('error-14-dynamic-string-invalid', () => {
		it('should detect invalid class in dynamic string variable', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).toContain('invalid-dynamic');
			} finally {
				plugin.dispose();
			}
		});
	});
});
`
  },
  // Pattern 3: Array simple
  {
    name: 'valid-25-array-simple',
    vue: `<script setup lang="ts">
// Pattern 3: Simple array of classes
// @validClasses [custom-button, flex, items-center]
</script>

<template>
  <div :class="['custom-button', 'flex', 'items-center']">
    Array simple
  </div>
</template>
`,
    spec: `import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] allowed-classes', () => {
	describe('valid-25-array-simple', () => {
		it('should accept :class with simple array of strings', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).toHaveLength(0);
			} finally {
				plugin.dispose();
			}
		});
	});
});
`
  },
  // Pattern 3: Array conditional
  {
    name: 'valid-26-array-conditional',
    vue: `<script setup lang="ts">
// Pattern 3: Array with conditional (&&)
// @validClasses [custom-button, flex, app-header]
const isActive = true;
</script>

<template>
  <div :class="['custom-button', isActive && 'flex', 'app-header']">
    Array conditional
  </div>
</template>
`,
    spec: `import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] allowed-classes', () => {
	describe('valid-26-array-conditional', () => {
		it('should accept :class array with conditional && operator', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).toHaveLength(0);
			} finally {
				plugin.dispose();
			}
		});
	});
});
`
  },
  // Pattern 3: Array with variable
  {
    name: 'valid-27-array-with-variable',
    vue: `<script setup lang="ts">
// Pattern 3: Array with variable
// @validClasses [custom-button, flex, app-header]
const sizeClass = 'app-header';
</script>

<template>
  <div :class="['custom-button', 'flex', sizeClass]">
    Array with variable
  </div>
</template>
`,
    spec: `import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] allowed-classes', () => {
	describe('valid-27-array-with-variable', () => {
		it('should accept :class array containing variable reference', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).toHaveLength(0);
			} finally {
				plugin.dispose();
			}
		});
	});
});
`
  },
  // Pattern 3 Error
  {
    name: 'error-15-array-invalid',
    vue: `<script setup lang="ts">
// Pattern 3 Error: Array with invalid class
// @invalidClasses [invalid-array-class]
// @validClasses [custom-button, flex]
</script>

<template>
  <div :class="['custom-button', 'invalid-array-class', 'flex']">
    Array with invalid
  </div>
</template>
`,
    spec: `import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] allowed-classes', () => {
	describe('error-15-array-invalid', () => {
		it('should detect invalid class in array', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).toContain('invalid-array-class');
			} finally {
				plugin.dispose();
			}
		});
	});
});
`
  },
  // Pattern 4: Object syntax
  {
    name: 'valid-28-object-syntax-boolean',
    vue: `<script setup lang="ts">
// Pattern 4: Object syntax (most idiomatic Vue)
// @validClasses [custom-button, app-header, project-card]
const isActive = true;
const isDisabled = false;
</script>

<template>
  <div :class="{ 'custom-button': true, 'app-header': isActive, 'project-card': isDisabled }">
    Object syntax
  </div>
</template>
`,
    spec: `import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] allowed-classes', () => {
	describe('valid-28-object-syntax-boolean', () => {
		it('should accept :class with object syntax and boolean values', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).toHaveLength(0);
			} finally {
				plugin.dispose();
			}
		});
	});
});
`
  },
  // Pattern 4 Error
  {
    name: 'error-16-object-syntax-invalid',
    vue: `<script setup lang="ts">
// Pattern 4 Error: Object syntax with invalid class key
// @invalidClasses [invalid-object-class]
// @validClasses [custom-button]
const isActive = true;
</script>

<template>
  <div :class="{ 'custom-button': true, 'invalid-object-class': isActive }">
    Object syntax with invalid
  </div>
</template>
`,
    spec: `import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] allowed-classes', () => {
	describe('error-16-object-syntax-invalid', () => {
		it('should detect invalid class in object syntax key', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).toContain('invalid-object-class');
			} finally {
				plugin.dispose();
			}
		});
	});
});
`
  },
  // Pattern 5: Mixed array + object
  {
    name: 'valid-29-mixed-array-object',
    vue: `<script setup lang="ts">
// Pattern 5: Mixed array + object (very common in real components)
// @validClasses [custom-button, flex, app-header, project-card]
const isActive = true;
const isDisabled = false;
const sizeClass = 'project-card';
</script>

<template>
  <div :class="[
    'custom-button',
    { 'app-header': isActive, 'flex': isDisabled },
    sizeClass
  ]">
    Mixed array + object
  </div>
</template>
`,
    spec: `import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] allowed-classes', () => {
	describe('valid-29-mixed-array-object', () => {
		it('should accept :class with mixed array and object syntax', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).toHaveLength(0);
			} finally {
				plugin.dispose();
			}
		});
	});
});
`
  },
  // Pattern 5 Error
  {
    name: 'error-17-mixed-array-object-invalid',
    vue: `<script setup lang="ts">
// Pattern 5 Error: Mixed with invalid in object
// @invalidClasses [invalid-mixed]
// @validClasses [custom-button, app-header]
const isActive = true;
</script>

<template>
  <div :class="[
    'custom-button',
    { 'app-header': true, 'invalid-mixed': isActive }
  ]">
    Mixed with invalid
  </div>
</template>
`,
    spec: `import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] allowed-classes', () => {
	describe('error-17-mixed-array-object-invalid', () => {
		it('should detect invalid class in mixed array+object', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).toContain('invalid-mixed');
			} finally {
				plugin.dispose();
			}
		});
	});
});
`
  },
  // Pattern 6: Computed property
  {
    name: 'valid-30-computed-property',
    vue: `<script setup lang="ts">
import { computed, ref } from 'vue';

// Pattern 6: Computed property
// @validClasses [custom-button, flex, app-header]
const isActive = ref(true);
const sizeClass = ref('app-header');

const classes = computed(() => [
  'custom-button',
  { 'flex': isActive.value },
  sizeClass.value
]);
</script>

<template>
  <div :class="classes">
    Computed property
  </div>
</template>
`,
    spec: `import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] allowed-classes', () => {
	describe('valid-30-computed-property', () => {
		it('should accept :class with computed property', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).toHaveLength(0);
			} finally {
				plugin.dispose();
			}
		});
	});
});
`
  },
  // Pattern 6 Error
  {
    name: 'error-18-computed-invalid',
    vue: `<script setup lang="ts">
import { computed, ref } from 'vue';

// Pattern 6 Error: Computed with invalid class
// @invalidClasses [invalid-computed]
// @validClasses [custom-button]
const isActive = ref(true);

const classes = computed(() => [
  'custom-button',
  { 'invalid-computed': isActive.value }
]);
</script>

<template>
  <div :class="classes">
    Computed with invalid
  </div>
</template>
`,
    spec: `import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] allowed-classes', () => {
	describe('error-18-computed-invalid', () => {
		it('should detect invalid class in computed property', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).toContain('invalid-computed');
			} finally {
				plugin.dispose();
			}
		});
	});
});
`
  },
  // Pattern 7: Function call
  {
    name: 'valid-31-function-call',
    vue: `<script setup lang="ts">
import { ref } from 'vue';

// Pattern 7: Function returning classes
// @validClasses [custom-button, flex, app-header]
const isActive = ref(true);

function getClasses() {
  return ['custom-button', { 'flex': isActive.value }, 'app-header'];
}
</script>

<template>
  <div :class="getClasses()">
    Function call
  </div>
</template>
`,
    spec: `import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] allowed-classes', () => {
	describe('valid-31-function-call', () => {
		it('should accept :class with function call returning classes', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).toHaveLength(0);
			} finally {
				plugin.dispose();
			}
		});
	});
});
`
  },
  // Pattern 7 Error
  {
    name: 'error-19-function-call-invalid',
    vue: `<script setup lang="ts">
// Pattern 7 Error: Function returning invalid class
// @invalidClasses [invalid-function]
// @validClasses [custom-button]

function getClasses() {
  return ['custom-button', 'invalid-function'];
}
</script>

<template>
  <div :class="getClasses()">
    Function with invalid
  </div>
</template>
`,
    spec: `import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] allowed-classes', () => {
	describe('error-19-function-call-invalid', () => {
		it('should detect invalid class in function return value', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).toContain('invalid-function');
			} finally {
				plugin.dispose();
			}
		});
	});
});
`
  },
  // Pattern 8: ref reactive
  {
    name: 'valid-32-ref-reactive',
    vue: `<script setup lang="ts">
import { ref } from 'vue';

// Pattern 8: ref reactive array
// @validClasses [custom-button, flex, app-header]
const classes = ref(['custom-button', 'flex', 'app-header']);
</script>

<template>
  <div :class="classes">
    Ref reactive
  </div>
</template>
`,
    spec: `import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] allowed-classes', () => {
	describe('valid-32-ref-reactive', () => {
		it('should accept :class with ref reactive array', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).toHaveLength(0);
			} finally {
				plugin.dispose();
			}
		});
	});
});
`
  },
  // Pattern 10: Combined class + :class
  {
    name: 'valid-33-combined-class-and-bind',
    vue: `<script setup lang="ts">
// Pattern 10: Combined static class + dynamic :class
// Vue merges them automatically
// @validClasses [custom-button, flex, app-header, project-card]
const isActive = true;
</script>

<template>
  <div
    class="custom-button flex"
    :class="{ 'app-header': isActive, 'project-card': !isActive }"
  >
    Combined class + :class
  </div>
</template>
`,
    spec: `import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] allowed-classes', () => {
	describe('valid-33-combined-class-and-bind', () => {
		it('should accept combined static class and dynamic :class', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).toHaveLength(0);
			} finally {
				plugin.dispose();
			}
		});
	});
});
`
  },
  // Pattern 10 Error
  {
    name: 'error-20-combined-class-bind-invalid',
    vue: `<script setup lang="ts">
// Pattern 10 Error: Combined with invalid in :class
// @invalidClasses [invalid-combined]
// @validClasses [custom-button, flex]
const isActive = true;
</script>

<template>
  <div
    class="custom-button flex"
    :class="{ 'invalid-combined': isActive }"
  >
    Combined with invalid
  </div>
</template>
`,
    spec: `import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] allowed-classes', () => {
	describe('error-20-combined-class-bind-invalid', () => {
		it('should detect invalid class in combined class + :class', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).toContain('invalid-combined');
			} finally {
				plugin.dispose();
			}
		});
	});
});
`
  },
  // Pattern 12: Template literal with props
  {
    name: 'valid-34-template-literal-props',
    vue: `<script setup lang="ts">
// Pattern 12: Template literal with props
// @validClasses [custom-button, flex]
const props = defineProps<{
  variant?: 'primary' | 'secondary'
}>();

// Using allowed classes with template literal
</script>

<template>
  <div :class="\`custom-button flex\`">
    Template literal
  </div>
</template>
`,
    spec: `import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] allowed-classes', () => {
	describe('valid-34-template-literal-props', () => {
		it('should accept :class with template literal', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).toHaveLength(0);
			} finally {
				plugin.dispose();
			}
		});
	});
});
`
  },
  // Pattern 12 Error
  {
    name: 'error-21-template-literal-invalid',
    vue: `<script setup lang="ts">
// Pattern 12 Error: Template literal with invalid class
// @invalidClasses [invalid-template]
// @validClasses [custom-button]
</script>

<template>
  <div :class="\`custom-button invalid-template\`">
    Template literal invalid
  </div>
</template>
`,
    spec: `import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] allowed-classes', () => {
	describe('error-21-template-literal-invalid', () => {
		it('should detect invalid class in template literal', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).toContain('invalid-template');
			} finally {
				plugin.dispose();
			}
		});
	});
});
`
  }
];

// Create all test files
for (const test of tests) {
  const testDir = path.join(baseDir, test.name);

  // Create directory if it doesn't exist
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }

  // Write files
  fs.writeFileSync(path.join(testDir, 'tsconfig.json'), tsconfig);
  fs.writeFileSync(path.join(testDir, 'global.css'), globalCss);
  fs.writeFileSync(path.join(testDir, 'example.vue'), test.vue);
  fs.writeFileSync(path.join(testDir, 'example.spec.tsx'), test.spec);

  console.log(`Created: ${test.name}`);
}

console.log(`\nTotal: ${tests.length} tests created`);
