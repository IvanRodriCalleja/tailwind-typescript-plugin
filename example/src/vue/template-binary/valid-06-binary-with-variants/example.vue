<script setup lang="ts">
const isActive = true;

// ✅ Valid: Binary expression with Tailwind variants
// @validClasses [flex, hover:bg-blue-500, md:text-lg]
</script>

<template>
  <div :class="`flex ${isActive && 'hover:bg-blue-500 md:text-lg'}`">Binary with variants</div>
</template>
