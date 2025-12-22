<script setup lang="ts">
// Pattern 4 Error: Object syntax with invalid class key
// @invalidClasses [invalid-object-class]
// @validClasses [custom-button]
const isActive = true;
</script>

<template>
  <div :class="{ 'custom-button': true, 'invalid-object-class': isActive }">
    Object syntax with invalid
  </div>
</template>
