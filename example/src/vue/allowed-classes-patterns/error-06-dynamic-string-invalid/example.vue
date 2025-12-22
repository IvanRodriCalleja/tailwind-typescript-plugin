<script setup lang="ts">
// ❌ Invalid: Dynamic string with class not matching pattern
// @invalidClasses [invalid-class]
// @validClasses [custom-button]
const myClass = 'custom-button invalid-class';
</script>

<template>
  <div :class="myClass">Dynamic string with invalid</div>
</template>
