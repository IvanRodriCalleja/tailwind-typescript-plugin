<script setup lang="ts">
const isActive = true;

// ✅ Valid: Parenthesized ternary expression
// @validClasses [bg-blue-500, bg-gray-500]
</script>

<template>
  <div :class="isActive ? 'bg-blue-500' : 'bg-gray-500'">Parenthesized ternary</div>
</template>
