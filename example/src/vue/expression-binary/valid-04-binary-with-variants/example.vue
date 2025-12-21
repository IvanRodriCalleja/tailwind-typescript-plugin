<script setup lang="ts">
const isActive = true;

// ✅ Valid: Binary with Tailwind variants
// @validClasses [hover:bg-blue-500, md:text-lg]
</script>

<template>
  <div :class="isActive && 'hover:bg-blue-500 md:text-lg'">Binary with variants</div>
</template>
