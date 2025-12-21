<script setup lang="ts">
const isError = true;

// ✅ Valid: Parenthesized binary expression
// @validClasses [text-red-500]
</script>

<template>
  <div :class="isError && 'text-red-500'">Parenthesized binary</div>
</template>
