<script setup lang="ts">
const isActive = true;

// ✅ Valid: Conditional with empty string in false branch
// @validClasses [flex, items-center, bg-blue-500]
</script>

<template>
  <div :class="`flex items-center ${isActive ? 'bg-blue-500' : ''}`">
  			Conditional with empty string
  		</div>
</template>
