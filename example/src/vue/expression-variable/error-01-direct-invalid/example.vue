<script setup lang="ts">
const invalidSingleClass = 'invalid-class';

// ❌ Invalid: Direct variable reference with invalid class
// @invalidClasses [invalid-class]
</script>

<template>
  <div :class="invalidSingleClass">Invalid variable reference</div>
</template>
