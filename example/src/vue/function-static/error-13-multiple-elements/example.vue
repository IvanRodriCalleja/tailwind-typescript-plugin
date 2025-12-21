<script setup lang="ts">
import clsx from 'clsx';

// ❌ Invalid: Multiple elements with different validation results
// @element {1} First child with invalid class
// @invalidClasses {1} [invalid-error]
// @validClasses {1} [flex]
// @element {2} Second child with all valid classes
// @validClasses {2} [flex, items-center, justify-center]
// @element {3} Third child with invalid class
// @invalidClasses {3} [invalid-class]
// @validClasses {3} [flex, items-center]
</script>

<template>
  <div class="flex flex-col">
  			<div :class="clsx('flex', 'invalid-error')">Invalid in first child</div>
  			<div :class="clsx('flex', 'items-center', 'justify-center')">Valid in second child</div>
  			<div :class="clsx('flex', 'items-center', 'invalid-class')">Invalid in third child</div>
  		</div>
</template>
