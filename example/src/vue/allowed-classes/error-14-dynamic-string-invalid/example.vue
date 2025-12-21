<script setup lang="ts">
// Pattern 2 Error: Dynamic string with invalid class
// @invalidClasses [invalid-dynamic]
// @validClasses [custom-button, flex]
const myClass = 'custom-button flex invalid-dynamic';
</script>

<template>
  <div :class="myClass">
    Dynamic string with invalid
  </div>
</template>
