<script setup lang="ts">
const isActive = true;

// ❌ Invalid: Self-closing element with invalid in binary
// @invalidClasses [invalid-style]
// @validClasses [rounded-lg]
</script>

<template>
  <img :class="isActive && 'rounded-lg invalid-style'" src="test.jpg" alt="test" />
</template>
