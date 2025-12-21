<script setup lang="ts">
const isActive = true;

// ✅ Valid: Ternary with empty string in true branch
// @validClasses [bg-gray-500]
</script>

<template>
  <div :class="isActive ? '' : 'bg-gray-500'">Empty true branch</div>
</template>
