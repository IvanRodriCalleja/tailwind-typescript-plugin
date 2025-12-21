<script setup lang="ts">
const isActive = true;

// ❌ Invalid: Ternary with invalid in non-empty branch
// @invalidClasses [invalid-class]
</script>

<template>
  <div :class="isActive ? 'invalid-class' : ''">Invalid with empty</div>
</template>
