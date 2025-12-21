<script setup lang="ts">
const isActive = true;

// ✅ Valid: Conditional with empty string in true branch
// @validClasses [flex, bg-gray-500]
</script>

<template>
  <div :class="`flex ${isActive ? '' : 'bg-gray-500'}`">Empty in true branch</div>
</template>
