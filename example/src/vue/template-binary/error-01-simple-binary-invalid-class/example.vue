<script setup lang="ts">
const isError = false;

// ❌ Invalid: Binary expression with invalid class
// @invalidClasses [invalid-error]
// @validClasses [flex]
</script>

<template>
  <div :class="`flex ${isError && 'invalid-error'}`">Binary expression with invalid class</div>
</template>
