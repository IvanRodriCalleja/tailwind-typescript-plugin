<script setup lang="ts">
const isActive = true;

// ❌ Invalid: Conditional with invalid class and empty string
// @invalidClasses [invalid-active]
// @validClasses [flex]
</script>

<template>
  <div :class="`flex ${isActive ? 'invalid-active' : ''}`">
  			Invalid class with empty string fallback
  		</div>
</template>
