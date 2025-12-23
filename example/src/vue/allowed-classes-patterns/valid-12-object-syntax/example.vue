<script setup lang="ts">
// ✅ Valid: Object syntax with classes matching patterns
// @validClasses [custom-button, close-icon]
const isActive = true;
</script>

<template>
  <div :class="{ 'custom-button': true, 'close-icon': isActive }">
    Object syntax with valid patterns
  </div>
</template>
