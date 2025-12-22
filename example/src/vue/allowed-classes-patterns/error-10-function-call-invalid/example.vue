<script setup lang="ts">
// ❌ Invalid: Function call with class not matching pattern
// @invalidClasses [invalid-function]
// @validClasses [custom-button]
function getClasses() {
  return 'custom-button invalid-function';
}
</script>

<template>
  <div :class="getClasses()">Function call with invalid</div>
</template>
