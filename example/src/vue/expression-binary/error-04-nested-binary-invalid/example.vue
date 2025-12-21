<script setup lang="ts">
const isError = true;
const isActive = true;

// ❌ Invalid: Nested binary with invalid class
// @invalidClasses [invalid-nested]
</script>

<template>
  <div :class="isError && isActive && 'invalid-nested'">Nested binary invalid</div>
</template>
