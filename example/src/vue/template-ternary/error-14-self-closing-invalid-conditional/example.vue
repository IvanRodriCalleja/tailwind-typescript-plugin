<script setup lang="ts">
const isActive = true;

// ❌ Invalid: Self-closing element with invalid class in conditional
// @invalidClasses [invalid-rounded]
// @validClasses [w-full, h-auto, rounded-full]
</script>

<template>
  <img
  			:class="`w-full h-auto ${isActive ? 'invalid-rounded' : 'rounded-full'}`"
  			src="test.jpg"
  			alt="test"
  		/>
</template>
