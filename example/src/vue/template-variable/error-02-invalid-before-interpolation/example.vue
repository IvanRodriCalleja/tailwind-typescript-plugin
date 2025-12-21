<script setup lang="ts">
const dynamicClass = 'some-dynamic-class';

// ❌ Invalid: Template literal with interpolation, invalid class before interpolation
// @invalidClasses [invalid-before]
</script>

<template>
  <div :class="`invalid-before ${dynamicClass}`">Invalid before interpolation</div>
</template>
