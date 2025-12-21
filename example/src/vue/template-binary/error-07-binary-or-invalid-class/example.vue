<script setup lang="ts">
const dynamicClass = 'some-dynamic-class';

// ❌ Invalid: Binary OR expression with invalid class
// @invalidClasses [invalid-fallback]
// @validClasses [flex]
</script>

<template>
  <div :class="`flex ${dynamicClass || 'invalid-fallback'}`">Binary OR with invalid class</div>
</template>
