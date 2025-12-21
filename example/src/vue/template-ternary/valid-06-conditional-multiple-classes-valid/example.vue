<script setup lang="ts">
const isActive = true;

// ✅ Valid: Conditional branches with multiple valid classes
// @validClasses [flex, bg-blue-500, text-white, font-bold, bg-gray-500, text-black]
</script>

<template>
  <div
  			:class="`flex ${isActive ? 'bg-blue-500 text-white font-bold' : 'bg-gray-500 text-black'}`">
  			Conditional with multiple classes per branch
  		</div>
</template>
