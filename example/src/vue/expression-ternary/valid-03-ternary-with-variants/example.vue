<script setup lang="ts">
const isActive = true;

// ✅ Valid: Ternary with Tailwind variants
// @validClasses [hover:bg-blue-500, md:text-lg, hover:bg-gray-500, md:text-sm]
</script>

<template>
  <div :class="isActive ? 'hover:bg-blue-500 md:text-lg' : 'hover:bg-gray-500 md:text-sm'">
  			Ternary with variants
  		</div>
</template>
