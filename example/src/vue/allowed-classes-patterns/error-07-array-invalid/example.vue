<script setup lang="ts">
// ❌ Invalid: Array with class not matching pattern
// @invalidClasses [invalid-array-class]
// @validClasses [custom-button, close-icon]
</script>

<template>
  <div :class="['custom-button', 'invalid-array-class', 'close-icon']">
    Array with invalid
  </div>
</template>
