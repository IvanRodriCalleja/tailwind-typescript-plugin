<script setup lang="ts">
import { tv } from 'tailwind-variants';

// ⚠️ Warning: Class in base repeated in variant
// @duplicateClasses [flex, flex]
const button = tv({
	base: 'flex items-center',
	variants: {
		size: {
			sm: 'flex text-sm'
		}
	}
});
</script>

<template>
  <button :class="button({ size: 'sm' })">Duplicate base + variant</button>
</template>
