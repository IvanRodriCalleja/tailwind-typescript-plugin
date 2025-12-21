<script setup lang="ts">
const dynamicClass = 'some-dynamic-class';
const isActive = true;
const isDisabled = false;

// ❌ Invalid: Complex example with static, dynamic, and conditional classes
// @invalidClasses [invalid-class]
// @validClasses [flex, items-center, justify-between, p-4, bg-blue-500, text-white, bg-gray-200, text-gray-800, rounded-lg]
</script>

<template>
  <div
  			:class="`flex items-center justify-between p-4 ${dynamicClass} ${isActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} ${isDisabled ? 'opacity-50' : ''} rounded-lg invalid-class`">
  			Complex real-world scenario
  		</div>
</template>
