<script setup lang="ts">
// ✅ Valid: Array syntax with classes matching patterns
// @validClasses [custom-button, close-icon, main-component-wrapper]
</script>

<template>
  <div :class="['custom-button', 'close-icon', 'main-component-wrapper']">
    Array syntax with valid patterns
  </div>
</template>
