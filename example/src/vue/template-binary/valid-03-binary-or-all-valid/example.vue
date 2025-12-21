<script setup lang="ts">
const dynamicClass = 'some-dynamic-class';

// ✅ Valid: Binary OR expression with valid class
// @validClasses [flex, bg-gray-500]
</script>

<template>
  <div :class="`flex ${dynamicClass || 'bg-gray-500'}`">Binary OR with valid class</div>
</template>
