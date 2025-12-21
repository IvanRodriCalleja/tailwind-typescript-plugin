<script setup lang="ts">
const hasError = true;

// ⚠️ Warning: Duplicate in template binary
// @duplicateClasses [border, border]
</script>

<template>
  <div :class="`flex border ${hasError && 'border text-red-500'}`">
  			Duplicate in template binary
  		</div>
</template>
