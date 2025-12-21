<script setup lang="ts">
const isActive = true;

// ❌ Invalid: Parenthesized ternary with invalid
// @invalidClasses [invalid-active]
// @validClasses [bg-gray-500]
</script>

<template>
  <div :class="isActive ? 'invalid-active' : 'bg-gray-500'">Parenthesized with invalid</div>
</template>
