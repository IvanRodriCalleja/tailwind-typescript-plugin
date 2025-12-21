<script setup lang="ts">
const isError = false;
const isActive = true;

// ✅ Valid: Nested binary expressions
// @validClasses [flex, text-red-500, font-bold]
</script>

<template>
  <div :class="`flex ${isError && isActive && 'text-red-500 font-bold'}`">
  			Nested binary expressions
  		</div>
</template>
