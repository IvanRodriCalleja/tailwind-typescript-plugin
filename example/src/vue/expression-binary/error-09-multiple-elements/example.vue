<script setup lang="ts">
const isError = true;

// ❌ Invalid: Multiple elements with different validation results
// @element {1} First child with invalid in binary
// @invalidClasses {1} [invalid-error]
// @element {2} Second child with all valid
// @validClasses {2} [text-red-500]
// @element {3} Third child with invalid
// @invalidClasses {3} [invalid-class]
</script>

<template>
  <div class="flex flex-col">
  			<div :class="isError && 'invalid-error'">Invalid in first child</div>
  			<div :class="isError && 'text-red-500'">Valid in second child</div>
  			<div :class="isError && 'invalid-class'">Invalid in third child</div>
  		</div>
</template>
