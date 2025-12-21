<script setup lang="ts">
const invalidClass = 'invalid-array-var';

// ❌ Invalid: Variable with invalid class used in array
// @invalidClasses [invalid-array-var]
</script>

<template>
  <div :class="[invalidClass, 'flex']">Invalid var in array</div>
</template>
