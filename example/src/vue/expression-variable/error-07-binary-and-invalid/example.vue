<script setup lang="ts">
const isActive = true;
const binaryAndInvalid = isActive && 'invalid-class';

// ❌ Invalid: Variable assigned from binary AND expression with invalid
// @invalidClasses [invalid-class]
</script>

<template>
  <div :class="binaryAndInvalid">Binary AND variable - invalid</div>
</template>
