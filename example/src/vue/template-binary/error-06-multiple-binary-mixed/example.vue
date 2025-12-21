<script setup lang="ts">
const isError = false;
const hasWarning = false;

// ❌ Invalid: Mix of valid and invalid binary expressions
// @invalidClasses [invalid-warning]
// @validClasses [flex, text-red-500]
</script>

<template>
  <div :class="`flex ${isError && 'text-red-500'} ${hasWarning && 'invalid-warning'}`">
  			Mix of valid and invalid binary expressions
  		</div>
</template>
