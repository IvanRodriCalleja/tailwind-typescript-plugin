<script setup lang="ts">
const isError = false;

// ❌ Invalid: Static invalid class before binary expression
// @invalidClasses [invalid-static]
// @validClasses [flex, text-red-500]
</script>

<template>
  <div :class="`flex invalid-static ${isError && 'text-red-500'}`">
  			Static invalid with binary
  		</div>
</template>
