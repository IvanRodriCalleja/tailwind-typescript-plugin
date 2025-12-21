<script setup lang="ts">
const multipleValidClasses = 'flex items-center justify-between';

// ✅ Valid: Variable with multiple valid classes
// @validClasses [flex, items-center, justify-between]
</script>

<template>
  <div :class="multipleValidClasses">Multiple valid classes</div>
</template>
