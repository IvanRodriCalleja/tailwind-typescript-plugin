<script setup lang="ts">
const isError = true;

// ✅ Valid: Binary with empty string (no classes to validate)
</script>

<template>
  <div :class="isError && ''">Binary with empty string</div>
</template>
