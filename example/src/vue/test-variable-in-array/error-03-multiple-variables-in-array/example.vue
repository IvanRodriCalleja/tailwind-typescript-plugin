<script setup lang="ts">
const validClass = 'flex';
const invalidClass = 'invalid-array-var';

// ❌ Invalid: Multiple variables in array, one with invalid class
// @invalidClasses [invalid-array-var]
</script>

<template>
  <div :class="[validClass, invalidClass, 'p-4']">Multiple vars in array</div>
</template>
