<script setup lang="ts">
const isError = false;
const isActive = true;

// ❌ Invalid: Binary and ternary with invalid classes
// @invalidClasses [invalid-error, invalid-active]
// @validClasses [flex, bg-gray-500]
</script>

<template>
  <div
  			:class="`flex ${isError && 'invalid-error'} ${isActive ? 'invalid-active' : 'bg-gray-500'}`">
  			Binary and ternary with invalid
  		</div>
</template>
