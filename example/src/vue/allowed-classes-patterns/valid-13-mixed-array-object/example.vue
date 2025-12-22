<script setup lang="ts">
// ✅ Valid: Mixed array + object with classes matching patterns
// @validClasses [custom-button, close-icon, nav-component-item]
const isActive = true;
</script>

<template>
  <div :class="['custom-button', { 'close-icon': isActive, 'nav-component-item': true }]">
    Mixed array + object with valid patterns
  </div>
</template>
