<script setup lang="ts">
const dynamicClass = 'some-dynamic-class';
const isActive = true;

// ❌ Invalid: Mix of regular interpolation and conditional with invalid
// @invalidClasses [invalid-class]
// @validClasses [flex, items-center, bg-blue-500, bg-gray-500]
</script>

<template>
  <div
  			:class="`flex ${dynamicClass} items-center ${isActive ? 'bg-blue-500' : 'bg-gray-500'} invalid-class`">
  			Mixed interpolation and conditional
  		</div>
</template>
