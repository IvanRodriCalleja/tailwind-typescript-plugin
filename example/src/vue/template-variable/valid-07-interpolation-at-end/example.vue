<script setup lang="ts">
const dynamicClass = 'some-dynamic-class';

// ✅ Valid: Interpolation at end with leading spaces
// @validClasses [flex, items-center]
</script>

<template>
  <div :class="`flex items-center ${dynamicClass}`">Interpolation at end</div>
</template>
