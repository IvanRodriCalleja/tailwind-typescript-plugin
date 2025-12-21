<script setup lang="ts">
const isActive = true;
const isDisabled = false;
const nestedTernaryInvalid = isActive
		? isDisabled
			? 'invalid-nested'
			: 'bg-green-500'
		: 'bg-gray-500';

// ❌ Invalid: Nested ternary with invalid class in nested branch
// @invalidClasses [invalid-nested]
// @validClasses [bg-green-500, bg-gray-500]
</script>

<template>
  <div :class="nestedTernaryInvalid">Nested ternary variable - invalid</div>
</template>
