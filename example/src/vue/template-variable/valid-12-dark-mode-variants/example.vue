<script setup lang="ts">
const dynamicClass = 'some-dynamic-class';

// ✅ Valid: Dark mode variants with interpolation
// @validClasses [bg-white, dark:bg-gray-900, text-black, dark:text-white]
</script>

<template>
  <div :class="`bg-white dark:bg-gray-900 ${dynamicClass} text-black dark:text-white`">
  			Dark mode variants with interpolation
  		</div>
</template>
