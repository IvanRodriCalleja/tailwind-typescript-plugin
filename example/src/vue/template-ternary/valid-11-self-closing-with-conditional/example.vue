<script setup lang="ts">
const isActive = true;

// ✅ Valid: Self-closing element with conditional
// @validClasses [w-full, h-auto, rounded, rounded-full]
</script>

<template>
  <img
  			:class="`w-full h-auto ${isActive ? 'rounded' : 'rounded-full'}`"
  			src="test.jpg"
  			alt="test"
  		/>
</template>
