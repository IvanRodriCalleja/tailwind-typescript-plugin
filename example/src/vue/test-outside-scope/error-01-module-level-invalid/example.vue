<script setup lang="ts">
const outsideInvalidClass = 'invalid-outside-class';

// ❌ Invalid: Variable defined at module level with invalid class
// @invalidClasses [invalid-outside-class]
</script>

<template>
  <div :class="outsideInvalidClass">Invalid outside scope</div>
</template>
