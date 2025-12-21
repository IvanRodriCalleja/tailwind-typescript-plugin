<script setup lang="ts">
const isActive = true;
const isError = false;

// ✅ Valid: Nested conditionals with valid classes
// @validClasses [flex, bg-blue-500, bg-red-500, bg-gray-500]
</script>

<template>
  <div :class="`flex ${isActive ? (isError ? 'bg-red-500' : 'bg-blue-500') : 'bg-gray-500'}`">
  			Nested conditionals with valid classes
  		</div>
</template>
