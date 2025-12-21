<script setup lang="ts">
const isError = true;

// ✅ Valid: Binary expression combined with static wrapper
// Note: This is actually a template literal pattern, not pure expression
// @validClasses [flex, text-red-500]
</script>

<template>
  <div :class="`flex ${isError && 'text-red-500'}`">Binary in template</div>
</template>
