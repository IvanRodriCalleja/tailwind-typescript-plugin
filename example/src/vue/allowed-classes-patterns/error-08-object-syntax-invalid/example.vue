<script setup lang="ts">
// ❌ Invalid: Object syntax with class key not matching pattern
// @invalidClasses [invalid-object-class]
// @validClasses [custom-button]
const isActive = true;
</script>

<template>
  <div :class="{ 'custom-button': true, 'invalid-object-class': isActive }">
    Object syntax with invalid
  </div>
</template>
