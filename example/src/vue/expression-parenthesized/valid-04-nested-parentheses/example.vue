<script setup lang="ts">
const isActive = true;

// ✅ Valid: Nested parentheses
// @validClasses [bg-green-500, bg-gray-500]
</script>

<template>
  <div :class="isActive ? 'bg-green-500' : 'bg-gray-500'">Nested parentheses</div>
</template>
