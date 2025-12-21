<script setup lang="ts">
import { tv } from 'tailwind-variants';

const button = tv({
		base: 'font-semibold',
		variants: {
			color: { primary: 'bg-blue-500' },
			size: { lg: 'text-lg' }
		},
		compoundVariants: [{ color: 'primary', size: 'lg', class: 'font-bold text-xl' }]
	});

// ✅ Valid: Compound variants with valid classes
// @validClasses [font-bold, text-xl]
</script>

<template>
  <button :class="button({ color: 'primary', size: 'lg' })">Valid Compound</button>
</template>
