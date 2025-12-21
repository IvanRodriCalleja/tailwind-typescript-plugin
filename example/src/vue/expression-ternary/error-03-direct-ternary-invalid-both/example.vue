<script setup lang="ts">
const isActive = true;

// ❌ Invalid: Direct ternary with invalid in both branches
// @invalidClasses [invalid-active, invalid-inactive]
</script>

<template>
  <div :class="isActive ? 'invalid-active' : 'invalid-inactive'">Invalid in both branches</div>
</template>
