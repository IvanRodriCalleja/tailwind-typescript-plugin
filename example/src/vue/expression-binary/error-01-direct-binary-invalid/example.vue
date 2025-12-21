<script setup lang="ts">
const isError = true;

// ❌ Invalid: Direct binary expression with invalid class
// @invalidClasses [invalid-error]
</script>

<template>
  <div :class="isError && 'invalid-error'">Direct binary with invalid</div>
</template>
