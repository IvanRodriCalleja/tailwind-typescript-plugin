<script setup lang="ts">
// Pattern 1 Error: Static class with invalid class
// @invalidClasses [invalid-static-class]
// @validClasses [custom-button, flex]
</script>

<template>
  <div class="custom-button flex invalid-static-class">
    Static class with invalid
  </div>
</template>
