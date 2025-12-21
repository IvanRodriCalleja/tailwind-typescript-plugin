<script setup lang="ts">
const isActive = true;

// ✅ Valid: Ternary combined with static in template
// Note: This is a template literal pattern, not pure expression
// @validClasses [flex, bg-blue-500, bg-gray-500]
</script>

<template>
  <div :class="`flex ${isActive ? 'bg-blue-500' : 'bg-gray-500'}`">Ternary in template</div>
</template>
