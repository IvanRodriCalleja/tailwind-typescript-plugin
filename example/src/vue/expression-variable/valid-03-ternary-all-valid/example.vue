<script setup lang="ts">
const isActive = true;
const ternaryValidClasses = isActive ? 'bg-blue-500' : 'bg-gray-500';

// ✅ Valid: Variable assigned from ternary with all valid classes
// @validClasses [bg-blue-500, bg-gray-500]
</script>

<template>
  <div :class="ternaryValidClasses">Ternary variable - all valid</div>
</template>
