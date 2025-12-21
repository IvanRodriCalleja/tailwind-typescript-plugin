<script setup lang="ts">
const isActive = true;

// ❌ Invalid: Conditional with invalid class in true branch
// @invalidClasses [invalid-active]
// @validClasses [flex, bg-gray-500]
</script>

<template>
  <div :class="`flex ${isActive ? 'invalid-active' : 'bg-gray-500'}`">
  			Invalid class in true branch
  		</div>
</template>
