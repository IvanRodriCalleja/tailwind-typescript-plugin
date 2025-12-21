<script setup lang="ts">
const outsideInvalidClass = 'invalid-outside-class';

// ❌ Invalid: Reusing the same invalid variable in multiple components
// @invalidClasses [invalid-outside-class]
</script>

<template>
  <div :class="outsideInvalidClass">Reuse 1</div>
</template>
