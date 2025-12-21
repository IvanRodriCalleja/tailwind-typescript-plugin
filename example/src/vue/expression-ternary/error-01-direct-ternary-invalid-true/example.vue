<script setup lang="ts">
const isActive = true;

// ❌ Invalid: Direct ternary with invalid in true branch
// @invalidClasses [invalid-active]
// @validClasses [bg-gray-500]
</script>

<template>
  <div :class="isActive ? 'invalid-active' : 'bg-gray-500'">Invalid in true branch</div>
</template>
