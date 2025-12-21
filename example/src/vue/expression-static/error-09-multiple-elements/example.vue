<script setup lang="ts">
// ❌ Invalid: Multiple elements with different validation results
// @element {1} First child with invalid class
// @invalidClasses {1} [validclass]
// @element {2} Second child with all valid classes
// @validClasses {2} [flex, items-center]
// @element {3} Third child with mixed valid and invalid classes
// @invalidClasses {3} [badclass]
// @validClasses {3} [container, mx-auto]
</script>

<template>
  <div class="flex flex-col">
  			<div class="validclass">Invalid in first child</div>
  			<div class="flex items-center">Valid in second child</div>
  			<div class="container mx-auto badclass">Invalid in third child</div>
  		</div>
</template>
