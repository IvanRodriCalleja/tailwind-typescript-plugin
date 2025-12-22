<script setup lang="ts">
// Pattern 2: Dynamic string variable
// @validClasses [custom-button, flex, items-center]
const myClass = 'custom-button flex items-center';
</script>

<template>
  <div :class="myClass">
    Dynamic string variable
  </div>
</template>
