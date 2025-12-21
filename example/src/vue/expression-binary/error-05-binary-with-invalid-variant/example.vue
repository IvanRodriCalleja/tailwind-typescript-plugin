<script setup lang="ts">
const isActive = true;

// ❌ Invalid: Binary with invalid variant
// @invalidClasses [invalid-variant:bg-blue]
</script>

<template>
  <div :class="isActive && 'invalid-variant:bg-blue'">Binary with invalid variant</div>
</template>
