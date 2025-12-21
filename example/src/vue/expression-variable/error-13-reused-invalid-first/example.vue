<script setup lang="ts">
const reusedInvalidClasses = 'invalid-reused';

// ❌ Invalid: Same invalid variable used multiple times - errors at declaration
// @invalidClasses [invalid-reused]
</script>

<template>
  <div :class="reusedInvalidClasses">Reused invalid - first</div>
</template>
