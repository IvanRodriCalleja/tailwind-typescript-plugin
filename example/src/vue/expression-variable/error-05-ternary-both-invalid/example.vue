<script setup lang="ts">
const isActive = true;
const ternaryBothInvalid = isActive ? 'invalid-active' : 'invalid-inactive';

// ❌ Invalid: Variable assigned from ternary with invalid in both branches
// @invalidClasses [invalid-active, invalid-inactive]
</script>

<template>
  <div :class="ternaryBothInvalid">Ternary variable - both invalid</div>
</template>
