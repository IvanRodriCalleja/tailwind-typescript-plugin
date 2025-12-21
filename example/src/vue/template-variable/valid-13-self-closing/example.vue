<script setup lang="ts">
const dynamicClass = 'some-dynamic-class';

// ✅ Valid: Self-closing element with template literal and interpolation
// @validClasses [w-full, h-auto]
</script>

<template>
  <img :class="`w-full ${dynamicClass} h-auto`" src="test.jpg" alt="test" />
</template>
