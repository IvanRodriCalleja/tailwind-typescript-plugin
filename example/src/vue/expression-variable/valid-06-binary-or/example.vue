<script setup lang="ts">
const isDisabled = false;
const binaryOrValid = isDisabled || 'bg-blue-500';

// ✅ Valid: Variable assigned from binary OR expression
// @validClasses [bg-blue-500]
</script>

<template>
  <div :class="binaryOrValid">Binary OR variable - valid</div>
</template>
