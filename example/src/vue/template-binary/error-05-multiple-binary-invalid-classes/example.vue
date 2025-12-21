<script setup lang="ts">
const isError = false;
const hasWarning = false;

// ❌ Invalid: Multiple binary expressions with invalid classes
// @invalidClasses [invalid-error, invalid-warning]
// @validClasses [flex]
</script>

<template>
  <div :class="`flex ${isError && 'invalid-error'} ${hasWarning && 'invalid-warning'}`">
  			Multiple binary expressions with invalid classes
  		</div>
</template>
