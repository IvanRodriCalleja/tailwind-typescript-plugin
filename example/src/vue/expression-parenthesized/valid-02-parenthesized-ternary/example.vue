<script setup lang="ts">
const isError = true;

// ✅ Valid: Parenthesized ternary
// @validClasses [bg-red-500, bg-blue-500]
</script>

<template>
  <div :class="isError ? 'bg-red-500' : 'bg-blue-500'">Parenthesized ternary</div>
</template>
