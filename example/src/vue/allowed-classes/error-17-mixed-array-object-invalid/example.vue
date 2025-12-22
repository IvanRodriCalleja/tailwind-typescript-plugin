<script setup lang="ts">
// Pattern 5 Error: Mixed with invalid in object
// @invalidClasses [invalid-mixed]
// @validClasses [custom-button, app-header]
const isActive = true;
</script>

<template>
  <div :class="[
    'custom-button',
    { 'app-header': true, 'invalid-mixed': isActive }
  ]">
    Mixed with invalid
  </div>
</template>
