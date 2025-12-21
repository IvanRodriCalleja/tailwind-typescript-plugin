<script setup lang="ts">
const isActive = true;

// ✅ Valid: Binary with arbitrary values
// @validClasses [h-[50vh], w-[100px]]
</script>

<template>
  <div :class="isActive && 'h-[50vh] w-[100px]'">Binary with arbitrary values</div>
</template>
