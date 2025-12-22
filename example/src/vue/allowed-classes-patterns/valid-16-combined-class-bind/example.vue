<script setup lang="ts">
// ✅ Valid: Combined static class + :class with classes matching patterns
// @validClasses [custom-button, close-icon, nav-component-item]
</script>

<template>
  <div class="custom-button" :class="['close-icon', 'nav-component-item']">
    Combined with valid patterns
  </div>
</template>
