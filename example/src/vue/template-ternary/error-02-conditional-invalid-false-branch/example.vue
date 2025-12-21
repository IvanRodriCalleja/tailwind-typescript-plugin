<script setup lang="ts">
const isActive = true;

// ❌ Invalid: Conditional with invalid class in false branch
// @invalidClasses [invalid-inactive]
// @validClasses [flex, bg-blue-500]
</script>

<template>
  <div :class="`flex ${isActive ? 'bg-blue-500' : 'invalid-inactive'}`">
  			Invalid class in false branch
  		</div>
</template>
