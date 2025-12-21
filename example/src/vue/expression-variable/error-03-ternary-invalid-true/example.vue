<script setup lang="ts">
const isActive = true;
const ternaryInvalidTrue = isActive ? 'invalid-active' : 'bg-gray-500';

// ❌ Invalid: Variable assigned from ternary with invalid in true branch
// @invalidClasses [invalid-active]
// @validClasses [bg-gray-500]
</script>

<template>
  <div :class="ternaryInvalidTrue">Ternary variable - invalid in true</div>
</template>
