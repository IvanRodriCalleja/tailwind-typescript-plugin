<script setup lang="ts">
const isError = false;
const hasWarning = false;

// ✅ Valid: Multiple binary expressions with valid classes
// @validClasses [flex, text-red-500, bg-yellow-100]
</script>

<template>
  <div :class="`flex ${isError && 'text-red-500'} ${hasWarning && 'bg-yellow-100'}`">
  			Multiple binary expressions with valid classes
  		</div>
</template>
