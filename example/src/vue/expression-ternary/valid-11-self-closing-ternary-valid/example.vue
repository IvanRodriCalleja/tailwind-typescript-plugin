<script setup lang="ts">
const isActive = true;

// ✅ Valid: Self-closing element with ternary expression
// @validClasses [rounded-lg, rounded-sm]
</script>

<template>
  <img :class="isActive ? 'rounded-lg' : 'rounded-sm'" src="test.jpg" alt="test" />
</template>
