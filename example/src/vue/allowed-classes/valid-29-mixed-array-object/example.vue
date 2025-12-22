<script setup lang="ts">
// Pattern 5: Mixed array + object (very common in real components)
// @validClasses [custom-button, flex, app-header, project-card]
const isActive = true;
const isDisabled = false;
const sizeClass = 'project-card';
</script>

<template>
  <div :class="[
    'custom-button',
    { 'app-header': isActive, 'flex': isDisabled },
    sizeClass
  ]">
    Mixed array + object
  </div>
</template>
