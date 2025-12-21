<script setup lang="ts">
const isError = true;

// ❌ Invalid: Parenthesized ternary with invalid class
// @invalidClasses [invalid-class]
// @validClasses [bg-blue-500]
</script>

<template>
  <div :class="isError ? 'invalid-class' : 'bg-blue-500'">Invalid in ternary</div>
</template>
