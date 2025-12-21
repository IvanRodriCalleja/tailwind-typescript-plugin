<script setup lang="ts">
const isError = false;
const isActive = true;

// ✅ Valid: Binary and ternary combined
// @validClasses [flex, text-red-500, bg-blue-500, bg-gray-500]
</script>

<template>
  <div
  			:class="`flex ${isError && 'text-red-500'} ${isActive ? 'bg-blue-500' : 'bg-gray-500'}`">
  			Binary and ternary combined
  		</div>
</template>
