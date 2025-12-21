<script setup lang="ts">
const isActive = true;

// ✅ Valid: Ternary with empty string in false branch
// @validClasses [bg-blue-500]
</script>

<template>
  <div :class="isActive ? 'bg-blue-500' : ''">Empty false branch</div>
</template>
