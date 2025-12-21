<script setup lang="ts">
const flex = true;

// ✅ Valid: Shorthand property where variable name is the class name
// In { flex }, 'flex' is both the key and the value
// @validClasses [flex]
</script>

<template>
  <div :class="{ flex }">Shorthand property</div>
</template>
