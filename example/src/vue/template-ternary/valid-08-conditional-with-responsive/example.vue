<script setup lang="ts">
const isActive = true;

// ✅ Valid: Conditional with responsive variants
// @validClasses [flex, md:grid, md:grid-cols-3, md:flex, md:flex-col]
</script>

<template>
  <div :class="`flex ${isActive ? 'md:grid md:grid-cols-3' : 'md:flex md:flex-col'}`">
  			Conditional with responsive variants
  		</div>
</template>
