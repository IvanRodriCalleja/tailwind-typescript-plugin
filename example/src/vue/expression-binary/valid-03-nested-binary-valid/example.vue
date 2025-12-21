<script setup lang="ts">
const isError = true;
const isActive = true;

// ✅ Valid: Nested binary expressions
// @validClasses [text-red-500, font-bold]
</script>

<template>
  <div :class="isError && isActive && 'text-red-500 font-bold'">Nested binary</div>
</template>
