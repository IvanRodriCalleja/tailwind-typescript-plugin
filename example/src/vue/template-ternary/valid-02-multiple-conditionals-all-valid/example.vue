<script setup lang="ts">
const isActive = true;

// ✅ Valid: Multiple conditionals with valid classes
// @validClasses [flex, bg-blue-500, bg-gray-500, text-white, text-black]
</script>

<template>
  <div
  			:class="`flex ${isActive ? 'bg-blue-500' : 'bg-gray-500'} ${isActive ? 'text-white' : 'text-black'}`">
  			Multiple conditionals with valid classes
  		</div>
</template>
