<script setup lang="ts">
import { tv } from 'tailwind-variants';

// ⚠️ Warning: Multiple duplicates across base and variants
// @duplicateClasses [flex, flex, items-center, items-center]
const button = tv({
	base: 'flex items-center p-4',
	variants: {
		size: {
			sm: 'flex text-sm',
			lg: 'items-center text-lg'
		}
	}
});
</script>

<template>
  <button :class="button({ size: 'sm' })">Multiple duplicates</button>
</template>
