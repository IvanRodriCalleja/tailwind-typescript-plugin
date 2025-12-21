<script setup lang="ts">
const isError = true;

// ❌ Invalid: Parenthesized binary with invalid class
// @invalidClasses [invalid-class]
</script>

<template>
  <div :class="isError && 'invalid-class'">Invalid in binary</div>
</template>
