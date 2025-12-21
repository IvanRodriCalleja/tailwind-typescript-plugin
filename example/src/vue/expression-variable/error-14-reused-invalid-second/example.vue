<script setup lang="ts">
const reusedInvalidClasses2 = 'invalid-reused-2';

// ❌ Invalid: Another function with invalid variable
// @invalidClasses [invalid-reused-2]
</script>

<template>
  <div :class="reusedInvalidClasses2">Reused invalid - second</div>
</template>
