<script setup lang="ts">
const isActive = true;
const ternaryInvalidFalse = isActive ? 'bg-blue-500' : 'invalid-inactive';

// ❌ Invalid: Variable assigned from ternary with invalid in false branch
// @invalidClasses [invalid-inactive]
// @validClasses [bg-blue-500]
</script>

<template>
  <div :class="ternaryInvalidFalse">Ternary variable - invalid in false</div>
</template>
