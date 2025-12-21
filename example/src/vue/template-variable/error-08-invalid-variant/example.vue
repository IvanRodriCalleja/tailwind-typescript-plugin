<script setup lang="ts">
const dynamicClass = 'some-dynamic-class';

// ❌ Invalid: Invalid variant with interpolation
// @invalidClasses [invalidvariant:bg-blue-500]
</script>

<template>
  <div :class="`${dynamicClass} invalidvariant:bg-blue-500`">
  			Invalid variant with interpolation
  		</div>
</template>
