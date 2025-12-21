<script setup lang="ts">
const isActive = true;

// ❌ Invalid: Conditional with invalid variant
// @invalidClasses [invalidvariant:bg-blue-500]
// @validClasses [flex, hover:bg-gray-500]
</script>

<template>
  <div :class="`flex ${isActive ? 'invalidvariant:bg-blue-500' : 'hover:bg-gray-500'}`">
  			Conditional with invalid variant
  		</div>
</template>
