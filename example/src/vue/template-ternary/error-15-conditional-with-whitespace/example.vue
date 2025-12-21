<script setup lang="ts">
const isActive = true;

// ❌ Invalid: Conditional with whitespace and invalid classes
// @invalidClasses [invalid-class]
// @validClasses [flex, bg-blue-500, bg-gray-500]
</script>

<template>
  <div :class="`flex   ${isActive ? 'bg-blue-500' : 'bg-gray-500'}   invalid-class`">
  			Conditional with extra whitespace
  		</div>
</template>
