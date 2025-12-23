<script setup lang="ts">
// ✅ Valid: Dynamic string with classes matching patterns
// @validClasses [custom-button, close-icon]
const myClass = 'custom-button close-icon';
</script>

<template>
  <div :class="myClass">Dynamic string with valid patterns</div>
</template>
