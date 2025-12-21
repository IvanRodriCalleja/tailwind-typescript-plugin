<script setup lang="ts">
const dynamicClass = 'some-dynamic-class';

// ❌ Invalid: Template literal with interpolation, mix of valid and invalid
// @invalidClasses [invalid-class]
// @validClasses [flex, items-center]
</script>

<template>
  <div :class="`flex ${dynamicClass} invalid-class items-center`">
  			Mixed valid and invalid with interpolation
  		</div>
</template>
