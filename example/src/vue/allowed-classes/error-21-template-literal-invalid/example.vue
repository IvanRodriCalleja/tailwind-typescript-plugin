<script setup lang="ts">
// Pattern 12 Error: Template literal with invalid class
// @invalidClasses [invalid-template]
// @validClasses [custom-button]
</script>

<template>
  <div :class="`custom-button invalid-template`">
    Template literal invalid
  </div>
</template>
