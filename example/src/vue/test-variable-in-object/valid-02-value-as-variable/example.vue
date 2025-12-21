<script setup lang="ts">
const condition = true;

// ✅ Valid: String literal key with variable value
// Not typical for className but should not crash
// @validClasses [bg-blue-500]
</script>

<template>
  <div :class="{ 'bg-blue-500': condition }">Value as variable</div>
</template>
