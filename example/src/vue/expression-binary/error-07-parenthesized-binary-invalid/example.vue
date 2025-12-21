<script setup lang="ts">
const isError = true;

// ❌ Invalid: Parenthesized binary with invalid
// @invalidClasses [invalid-error]
</script>

<template>
  <div :class="isError && 'invalid-error'">Parenthesized with invalid</div>
</template>
