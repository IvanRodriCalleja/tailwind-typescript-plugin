<script setup lang="ts">
// Pattern 3 Error: Array with invalid class
// @invalidClasses [invalid-array-class]
// @validClasses [custom-button, flex]
</script>

<template>
  <div :class="['custom-button', 'invalid-array-class', 'flex']">
    Array with invalid
  </div>
</template>
