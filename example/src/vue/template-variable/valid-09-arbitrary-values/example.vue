<script setup lang="ts">
const dynamicClass = 'some-dynamic-class';

// ✅ Valid: Arbitrary values with interpolation
// @validClasses [h-[50vh], w-[100px], bg-[#ff0000]]
</script>

<template>
  <div :class="`h-[50vh] ${dynamicClass} w-[100px] bg-[#ff0000]`">
  			Arbitrary values with interpolation
  		</div>
</template>
