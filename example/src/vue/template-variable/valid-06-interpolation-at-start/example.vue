<script setup lang="ts">
const dynamicClass = 'some-dynamic-class';

// ✅ Valid: Interpolation at start with trailing spaces
// @validClasses [flex, items-center]
</script>

<template>
  <div :class="`${dynamicClass} flex items-center`">Interpolation at start</div>
</template>
