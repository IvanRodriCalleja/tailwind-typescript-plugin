<script setup lang="ts">
// ✅ Valid: Template literal with classes matching patterns
// @validClasses [custom-button, close-icon]
const variant = 'button';
</script>

<template>
  <div :class="`custom-${variant} close-icon`">
    Template literal with valid patterns
  </div>
</template>
