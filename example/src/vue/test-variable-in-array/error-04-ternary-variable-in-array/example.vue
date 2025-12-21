<script setup lang="ts">
const isActive = true;
const ternaryClass = isActive ? 'bg-blue-500' : 'invalid-ternary-array';

// ❌ Invalid: Ternary variable with invalid class in false branch used in array
// @invalidClasses [invalid-ternary-array]
</script>

<template>
  <div :class="[ternaryClass, 'rounded']">Ternary var in array</div>
</template>
