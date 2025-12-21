<script setup lang="ts">
const imgClasses = 'w-full h-auto';

// ✅ Valid: Self-closing element with variable reference
// @validClasses [w-full, h-auto]
</script>

<template>
  <img :class="imgClasses" src="test.jpg" alt="test" />
</template>
