<script setup lang="ts">
const isError = true;
const hasWarning = false;

// ✅ Valid: Complex boolean with all valid
// @validClasses [bg-red-500]
</script>

<template>
  <div :class="(isError || hasWarning) && 'bg-red-500'">Complex boolean logic</div>
</template>
