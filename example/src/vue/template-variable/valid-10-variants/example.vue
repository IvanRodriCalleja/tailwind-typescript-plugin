<script setup lang="ts">
const dynamicClass = 'some-dynamic-class';

// ✅ Valid: Variants with interpolation
// @validClasses [hover:bg-blue-500, focus:ring-2, md:flex]
</script>

<template>
  <div :class="`hover:bg-blue-500 ${dynamicClass} focus:ring-2 md:flex`">
  			Variants with interpolation
  		</div>
</template>
