<script setup lang="ts">
const isError = false;

// ✅ Valid: Simple binary expression with valid class
// @validClasses [flex, text-red-500]
</script>

<template>
  <div :class="`flex ${isError && 'text-red-500'}`">
  			Simple binary expression with valid class
  		</div>
</template>
