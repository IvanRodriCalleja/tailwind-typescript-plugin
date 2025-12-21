<script setup lang="ts">
const validClass = 'flex';
const invalidClass = 'invalid-array-var';

// ❌ Invalid: Variables in nested array with invalid class
// @invalidClasses [invalid-array-var]
</script>

<template>
  <div :class="[validClass, [invalidClass, 'grid']]">Nested array with var</div>
</template>
