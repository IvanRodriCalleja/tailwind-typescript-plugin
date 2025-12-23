<script setup lang="ts">
// ✅ Valid: Conditional ternary with classes matching patterns
// @validClasses [custom-button, custom-link, close-icon]
const isButton = true;
</script>

<template>
  <div :class="[isButton ? 'custom-button' : 'custom-link', 'close-icon']">
    Conditional with valid patterns
  </div>
</template>
