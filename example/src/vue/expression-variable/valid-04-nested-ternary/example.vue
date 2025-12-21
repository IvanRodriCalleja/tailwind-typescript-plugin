<script setup lang="ts">
const isActive = true;
const isDisabled = false;
const nestedTernaryValid = isActive
		? isDisabled
			? 'bg-blue-500'
			: 'bg-green-500'
		: 'bg-gray-500';

// ✅ Valid: Nested ternary variable assignment
// @validClasses [bg-blue-500, bg-green-500, bg-gray-500]
</script>

<template>
  <div :class="nestedTernaryValid">Nested ternary variable - valid</div>
</template>
