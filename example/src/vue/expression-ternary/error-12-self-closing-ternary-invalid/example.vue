<script setup lang="ts">
const isActive = true;

// ❌ Invalid: Self-closing element with invalid in ternary
// @invalidClasses [invalid-style]
// @validClasses [rounded-lg]
</script>

<template>
  <img :class="isActive ? 'invalid-style' : 'rounded-lg'" src="test.jpg" alt="test" />
</template>
