<script setup lang="ts">
const isActive = true;

// ⚠️ Warning: Duplicate in template ternary
// @duplicateClasses [p-4, p-4]
</script>

<template>
  <div :class="`p-4 ${isActive ? 'p-4 bg-blue-500' : 'bg-gray-500'}`">
  			Duplicate in template ternary
  		</div>
</template>
