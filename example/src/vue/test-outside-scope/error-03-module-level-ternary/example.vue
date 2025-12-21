<script setup lang="ts">
const isActive = true;
const outsideTernary = isActive ? 'bg-blue-500' : 'invalid-ternary-outside';

// ❌ Invalid: Ternary expression at module level with invalid class
// @validClasses [bg-blue-500]
// @invalidClasses [invalid-ternary-outside]
</script>

<template>
  <div :class="outsideTernary">Ternary outside scope</div>
</template>
