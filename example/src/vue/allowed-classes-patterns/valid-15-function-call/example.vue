<script setup lang="ts">
// ✅ Valid: Function call with classes matching patterns
// @validClasses [custom-button, close-icon]
function getClasses() {
  return 'custom-button close-icon';
}
</script>

<template>
  <div :class="getClasses()">Function call with valid patterns</div>
</template>
