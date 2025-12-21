<script setup lang="ts">
const isActive = true;
const binaryAndValid = isActive && 'bg-blue-500';

// ✅ Valid: Variable assigned from binary AND expression
// @validClasses [bg-blue-500]
</script>

<template>
  <div :class="binaryAndValid">Binary AND variable - valid</div>
</template>
