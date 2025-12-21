<script setup lang="ts">
const isActive = true;

// ✅ Valid: Parenthesized conditional expression
// @validClasses [flex, bg-blue-500, bg-gray-500]
</script>

<template>
  <div :class="`flex ${isActive ? 'bg-blue-500' : 'bg-gray-500'}`">
  			Parenthesized conditional
  		</div>
</template>
