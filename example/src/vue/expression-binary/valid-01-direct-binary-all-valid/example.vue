<script setup lang="ts">
const isError = true;

// ✅ Valid: Direct binary expression with valid class
// @validClasses [text-red-500]
</script>

<template>
  <div :class="isError && 'text-red-500'">Direct binary expression</div>
</template>
