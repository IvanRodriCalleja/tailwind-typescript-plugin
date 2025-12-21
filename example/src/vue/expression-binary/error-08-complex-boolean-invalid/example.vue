<script setup lang="ts">
const isError = true;
const hasWarning = false;

// ❌ Invalid: Complex boolean with invalid class
// @invalidClasses [invalid-alert]
</script>

<template>
  <div :class="(isError || hasWarning) && 'invalid-alert'">Complex boolean invalid</div>
</template>
