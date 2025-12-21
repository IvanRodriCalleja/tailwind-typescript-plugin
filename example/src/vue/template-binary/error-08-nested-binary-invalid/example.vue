<script setup lang="ts">
const isError = false;
const isActive = true;

// ❌ Invalid: Nested binary expressions with invalid class
// @invalidClasses [invalid-nested]
// @validClasses [flex]
</script>

<template>
  <div :class="`flex ${isError && isActive && 'invalid-nested'}`">
  			Nested binary with invalid
  		</div>
</template>
