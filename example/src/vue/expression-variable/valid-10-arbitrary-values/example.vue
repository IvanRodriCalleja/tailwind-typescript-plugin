<script setup lang="ts">
const arbitraryValid = 'h-[50vh] w-[100px] bg-[#ff0000]';

// ✅ Valid: Variable with arbitrary values
// @validClasses [h-[50vh], w-[100px], bg-[#ff0000]]
</script>

<template>
  <div :class="arbitraryValid">Arbitrary values in variable - valid</div>
</template>
