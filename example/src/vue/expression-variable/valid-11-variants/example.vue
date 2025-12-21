<script setup lang="ts">
const variantsValid = 'hover:bg-blue-500 focus:ring-2 md:flex';

// ✅ Valid: Variable with Tailwind variants
// @validClasses [hover:bg-blue-500, focus:ring-2, md:flex]
</script>

<template>
  <div :class="variantsValid">Variants in variable - valid</div>
</template>
