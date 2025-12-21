<script setup lang="ts">
const dynamicClass = 'some-dynamic-class';

// ❌ Invalid: Template literal with interpolation, invalid classes on both sides
// @invalidClasses [invalid-before, invalid-after]
</script>

<template>
  <div :class="`invalid-before ${dynamicClass} invalid-after`">
  			Invalid before and after interpolation
  		</div>
</template>
