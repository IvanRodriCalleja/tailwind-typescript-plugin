<script setup lang="ts">
const isActive = true;

// ✅ Valid: Binary expression with arbitrary values
// @validClasses [flex, h-[50vh], w-[100px]]
</script>

<template>
  <div :class="`flex ${isActive && 'h-[50vh] w-[100px]'}`">Binary with arbitrary values</div>
</template>
