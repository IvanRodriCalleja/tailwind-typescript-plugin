<script setup lang="ts">
const isActive = true;

// ✅ Valid: Conditional with variants
// @validClasses [flex, hover:bg-blue-500, hover:bg-gray-500]
</script>

<template>
  <div :class="`flex ${isActive ? 'hover:bg-blue-500' : 'hover:bg-gray-500'}`">
  			Conditional with hover variants
  		</div>
</template>
