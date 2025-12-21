<script setup lang="ts">
const isError = true;

// ✅ Valid: Parenthesized binary expression
// @validClasses [bg-red-500]
</script>

<template>
  <div :class="isError && 'bg-red-500'">Parenthesized binary</div>
</template>
