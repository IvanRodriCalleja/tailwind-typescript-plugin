<script setup lang="ts">
import { tv } from 'tailwind-variants';

const button = tv({
		base: 'flex items-center',
		variants: {
			color: { primary: 'bg-blue-500' },
			size: { lg: 'text-lg' }
		},
		compoundVariants: [{ color: 'primary', size: 'lg', class: 'flex font-bold' }]
	});

// ⚠️ Warning: Class in base repeated in compoundVariants
// @duplicateClasses [flex, flex]
</script>

<template>
  <button :class="button({ color: 'primary', size: 'lg' })">Compound duplicate</button>
</template>
