<script setup lang="ts">
const isError = false;

// ❌ Invalid: Multiple elements with different validation results
// @element {1} First child with invalid class in binary
// @invalidClasses {1} [invalid-error]
// @validClasses {1} [flex]
// @element {2} Second child with all valid classes
// @validClasses {2} [flex, text-red-500]
// @element {3} Third child with invalid class
// @invalidClasses {3} [invalid-class]
// @validClasses {3} [flex]
</script>

<template>
  <div class="flex flex-col">
  			<div :class="`flex ${isError && 'invalid-error'}`">Invalid in first child</div>
  			<div :class="`flex ${isError && 'text-red-500'}`">Valid in second child</div>
  			<div :class="`flex ${isError && 'invalid-class'}`">Invalid in third child</div>
  		</div>
</template>
