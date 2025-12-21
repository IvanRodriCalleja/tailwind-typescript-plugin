<script setup lang="ts">
const dynamicClass = 'some-dynamic-class';

// ✅ Valid: Template literal with interpolation, all static parts valid
// @validClasses [flex, items-center]
</script>

<template>
  <div :class="`flex ${dynamicClass} items-center`">Valid classes with interpolation</div>
</template>
