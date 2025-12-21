<script setup lang="ts">
const isActive = true;

// ✅ Valid: Ternary with undefined result (ignored)
// @validClasses [bg-gray-500]
</script>

<template>
  <div :class="isActive ? undefined : 'bg-gray-500'">Ternary with undefined</div>
</template>
