<script setup lang="ts">
const isActive = true;
const isDisabled = false;

// ✅ Valid: Ternary with complex condition
// @validClasses [bg-red-500, bg-gray-500]
</script>

<template>
  <div :class="isActive && !isDisabled ? 'bg-red-500' : 'bg-gray-500'">Complex condition</div>
</template>
