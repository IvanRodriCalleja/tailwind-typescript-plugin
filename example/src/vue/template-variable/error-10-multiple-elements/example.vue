<script setup lang="ts">
const dynamicClass = 'some-dynamic-class';
const anotherClass = 'another-class';

// ❌ Invalid: Multiple elements with template literals
// @element {1} First child with invalid class in template
// @invalidClasses {1} [bad-class]
// @validClasses {1} [flex]
// @element {2} Second child with all valid classes
// @validClasses {2} [container, mx-auto]
// @element {3} Third child with invalid class after interpolation
// @invalidClasses {3} [another-bad]
// @validClasses {3} [grid]
</script>

<template>
  <div class="flex flex-col">
  			<div :class="`flex ${dynamicClass} bad-class`">Invalid in first child</div>
  			<div :class="`container ${anotherClass} mx-auto`">Valid in second child</div>
  			<div :class="`grid ${dynamicClass} another-bad`">Invalid in third child</div>
  		</div>
</template>
