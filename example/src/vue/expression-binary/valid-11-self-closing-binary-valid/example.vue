<script setup lang="ts">
const isActive = true;

// ✅ Valid: Self-closing element with binary expression
// @validClasses [rounded-lg, shadow-md]
</script>

<template>
  <img :class="isActive && 'rounded-lg shadow-md'" src="test.jpg" alt="test" />
</template>
