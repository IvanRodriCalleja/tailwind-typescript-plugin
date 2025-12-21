<script setup lang="ts">
const dynamicClass = 'some-dynamic-class';

// ✅ Valid: Empty static parts (only interpolation)
</script>

<template>
  <div :class="`${dynamicClass}`">Only interpolation</div>
</template>
