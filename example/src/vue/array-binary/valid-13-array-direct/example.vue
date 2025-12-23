<script setup lang="ts">
const isError = true;

// ✅ Valid: Direct array syntax without cn/clsx, all valid classes
// @validClasses [flex, text-red-500]
</script>

<template>
  <div :class="['flex', isError && 'text-red-500']">Direct array with binary</div>
</template>
