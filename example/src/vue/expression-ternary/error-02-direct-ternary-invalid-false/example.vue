<script setup lang="ts">
const isActive = true;

// ❌ Invalid: Direct ternary with invalid in false branch
// @invalidClasses [invalid-inactive]
// @validClasses [bg-blue-500]
</script>

<template>
  <div :class="isActive ? 'bg-blue-500' : 'invalid-inactive'">Invalid in false branch</div>
</template>
