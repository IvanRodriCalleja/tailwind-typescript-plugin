<script setup lang="ts">
// Pattern 7 Error: Function returning invalid class
// @invalidClasses [invalid-function]
// @validClasses [custom-button]

function getClasses() {
  return ['custom-button', 'invalid-function'];
}
</script>

<template>
  <div :class="getClasses()">
    Function with invalid
  </div>
</template>
