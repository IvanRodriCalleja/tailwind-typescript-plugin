<script setup lang="ts">
const dynamicClass = 'some-dynamic-class';

// ❌ Invalid: Template literal with interpolation, invalid class after interpolation
// @invalidClasses [invalid-after]
</script>

<template>
  <div :class="`${dynamicClass} invalid-after`">Invalid after interpolation</div>
</template>
