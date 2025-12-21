<script setup lang="ts">
const isError = true;

// ✅ Valid: Direct OR binary expression
// @validClasses [bg-gray-500]
</script>

<template>
  <div :class="isError || 'bg-gray-500'">Direct OR expression</div>
</template>
