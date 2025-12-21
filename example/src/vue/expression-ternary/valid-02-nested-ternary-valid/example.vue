<script setup lang="ts">
const isActive = true;
const isDisabled = false;

// ✅ Valid: Nested ternary expressions
// @validClasses [bg-blue-500, bg-green-500, bg-gray-500]
</script>

<template>
  <div :class="isActive ? (isDisabled ? 'bg-blue-500' : 'bg-green-500') : 'bg-gray-500'">
  			Nested ternary
  		</div>
</template>
