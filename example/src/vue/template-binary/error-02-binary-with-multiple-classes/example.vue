<script setup lang="ts">
const isError = false;

// ❌ Invalid: Binary expression with multiple classes, one invalid
// @invalidClasses [invalid-class]
// @validClasses [flex, text-red-500, font-bold]
</script>

<template>
  <div :class="`flex ${isError && 'text-red-500 invalid-class font-bold'}`">
  			Binary with multiple classes
  		</div>
</template>
