<script setup lang="ts">
const isError = true;

// ✅ Valid: Type assertion on ternary
// @validClasses [bg-red-500, bg-blue-500]
</script>

<template>
  <div :class="(isError ? 'bg-red-500' : 'bg-blue-500') as string">
  			Type assertion on ternary
  		</div>
</template>
