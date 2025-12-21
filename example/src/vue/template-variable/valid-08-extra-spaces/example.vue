<script setup lang="ts">
const dynamicClass = 'some-dynamic-class';
const anotherClass = 'another-class';

// ✅ Valid: Extra spaces around interpolations
// @validClasses [flex, items-center, justify-center]
</script>

<template>
  <div :class="`flex  ${dynamicClass}  items-center   ${anotherClass}   justify-center`">
  			Extra spaces (should be handled correctly)
  		</div>
</template>
