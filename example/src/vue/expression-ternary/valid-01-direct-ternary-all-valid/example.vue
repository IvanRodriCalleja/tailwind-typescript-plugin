<script setup lang="ts">
const isActive = true;

// ✅ Valid: Direct ternary expression with all valid classes
// @validClasses [bg-blue-500, bg-gray-500]
</script>

<template>
  <div :class="isActive ? 'bg-blue-500' : 'bg-gray-500'">Direct ternary expression</div>
</template>
