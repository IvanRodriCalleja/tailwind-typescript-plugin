<script setup lang="ts">
const isError = true;

// ❌ Invalid: Direct OR binary expression with invalid class
// @invalidClasses [invalid-fallback]
</script>

<template>
  <div :class="isError || 'invalid-fallback'">OR with invalid class</div>
</template>
