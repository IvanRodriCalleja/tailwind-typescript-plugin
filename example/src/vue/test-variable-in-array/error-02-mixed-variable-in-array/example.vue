<script setup lang="ts">
const mixedClasses = 'items-center invalid-mixed-array';

// ❌ Invalid: Variable with mixed valid and invalid classes used in array
// @invalidClasses [invalid-mixed-array]
</script>

<template>
  <div :class="[mixedClasses, 'justify-between']">Mixed var in array</div>
</template>
