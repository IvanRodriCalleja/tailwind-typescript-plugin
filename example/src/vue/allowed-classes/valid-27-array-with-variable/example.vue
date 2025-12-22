<script setup lang="ts">
// Pattern 3: Array with variable
// @validClasses [custom-button, flex, app-header]
const sizeClass = 'app-header';
</script>

<template>
  <div :class="['custom-button', 'flex', sizeClass]">
    Array with variable
  </div>
</template>
