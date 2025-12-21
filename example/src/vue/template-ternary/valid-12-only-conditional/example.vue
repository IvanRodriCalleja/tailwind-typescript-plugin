<script setup lang="ts">
const isActive = true;

// ✅ Valid: Only conditional expression, no static classes
// @validClasses [bg-blue-500, bg-gray-500]
</script>

<template>
  <div :class="`${isActive ? 'bg-blue-500' : 'bg-gray-500'}`">Only conditional</div>
</template>
