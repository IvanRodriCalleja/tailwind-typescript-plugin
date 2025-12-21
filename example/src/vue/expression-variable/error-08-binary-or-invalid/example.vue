<script setup lang="ts">
const isDisabled = false;
const binaryOrInvalid = isDisabled || 'invalid-fallback';

// ❌ Invalid: Variable assigned from binary OR expression with invalid
// @invalidClasses [invalid-fallback]
</script>

<template>
  <div :class="binaryOrInvalid">Binary OR variable - invalid</div>
</template>
